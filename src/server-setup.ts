import Fastify, { FastifyInstance } from "fastify";
import { mercurius } from "mercurius";
import { AuthenticationMiddleware } from "./authenticate-middleware";
import { authenticationHandler } from "./domain/authenticate";
import { createUserHandler } from "./domain/create-user";
import { findUserByIdHandler, findUsersHandler } from "./domain/find-users";
import { configureErrorHandler } from "./error-handler";
import { CustomError } from "./exceptions/exception.types";
import { AuthRequest } from "./models/auth-request.types";
import { PaginatedRequest, UserRequest } from "./models/user-request.types";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schemas/graphql-schema";
import { authenticationOptions, createUserOptions, getUserByIdOptions, getUserOptions } from "./schemas/server-schema";

const fastify: FastifyInstance = Fastify({ logger: true });

fastify.get<{ Querystring: PaginatedRequest }>("/users", getUserOptions, async (request, reply) => {
  const userResponse = await findUsersHandler(request.query);

  reply.status(200).send(userResponse);
});

fastify.get<{ Params: { id: number } }>("/users/:id", getUserByIdOptions, async (request, reply) => {
  const userResponse = await findUserByIdHandler(request.params.id);

  reply.status(200).send(userResponse);
});

fastify.post<{ Body: UserRequest }>("/users", createUserOptions, async (request, reply) => {
  const { body } = request;

  const userResponse = await createUserHandler(body)

  reply.status(201).send(userResponse);
});

fastify.post<{ Body: AuthRequest }>("/auth", authenticationOptions, async (request, reply) => {
  const { body } = request;

  const userResponse = await authenticationHandler(body);

  reply.status(201).send(userResponse);
});

fastify.setErrorHandler((error, request, reply) =>
  configureErrorHandler(error, request, reply)
);

fastify.register(mercurius, {
  schema: typeDefs,
  resolvers: resolvers,
  graphiql: true,
  context: async (request, reply) => {
    try {
      await AuthenticationMiddleware.authenticate(request, reply);
      return { request };
    } catch (error) {
      const customError = error as CustomError;

      return (
        {
          error: {
            message: customError.message ?? 'Erro interno do servidor',
            extensions: {
              code: customError.code ?? 'UNEXPECTED_ERROR',
              details: customError.details
            }
          }
        }
      );
    }
  },
})

export async function serverSetup(): Promise<FastifyInstance> {
  try {
    const port = process.env.PORT ? +process.env.PORT : 30001;
    await fastify.listen({ port });
    fastify.log.info(`Server listening on ${port}`);

    return fastify;
  } catch (err: unknown) {
    fastify.log.error(err);
    process.exit(1);
  }
};
