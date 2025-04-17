import { AuthenticationMiddleware } from "./authenticate-middleware"


export const getUserByIdOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        id: { type: "number", pattern: "^[0-9]+$" }
      },
      required: ["id"],
    },
  },
  preHandler: [AuthenticationMiddleware.authenticate]
}

export const createUserOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        birthDate: { type: 'string', format: 'date' }
      }
    }
  },
  preHandler: [AuthenticationMiddleware.authenticate]
}

export const authenticationOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        rememberMe: { type: 'boolean' },
      }
    }
  }
}
