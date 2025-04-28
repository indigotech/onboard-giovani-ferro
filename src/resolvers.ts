import { GraphQLError } from 'graphql';
import { createUserHandler } from './domain/create-user';
import { findUserByIdHandler } from './domain/find-users';
import { CustomError } from './exceptions/exception.types';
import { UserRequest } from './models/user-request.types';

export const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: number }, context: any) => {
      try {
        const userResponse = await findUserByIdHandler(id);

        if (context.error) {
          throw ({
            message: context.error.message,
            code: context.error.extensions.code,
            details: context.error.extensions.details ? context.error.extensions.details : undefined
          })
        }

        return userResponse;
      } catch (error) {
        const customError = error as CustomError;

        throw new GraphQLError(customError.message || 'Erro interno do servidor',
          {
            extensions: {
              code: customError.code || 'UNEXPECTED_ERROR',
              details: 'details' in customError ? customError.details : undefined
            }
          })
      }
    }
  },
  Mutation: {
    createUser: async (_: any, { data }: { data: UserRequest }, context: any) => {
      try {
        if (context.error) {
          throw ({
            message: context.error.message,
            code: context.error.extensions.code,
            details: context.error.extensions.details ? context.error.extensions.details : undefined
          })
        }

        const user = await createUserHandler(data);

        return user;
      } catch (error) {
        const customError = error as CustomError;
        throw new GraphQLError(customError.message || 'Erro interno do servidor',
          {
            extensions: {
              code: customError.code || 'UNEXPECTED_ERROR',
              details: 'details' in customError ? customError.details : undefined
            }
          })
      }

    }
  }
};
