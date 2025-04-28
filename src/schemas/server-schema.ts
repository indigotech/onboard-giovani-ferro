import { AuthenticationMiddleware } from "../authenticate-middleware"


export const getUserByIdOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        id: { type: "integer", nullable: false }
      },
      required: ["id"],
    },
  },
  preHandler: [AuthenticationMiddleware.authenticate]
}

export const getUserOptions = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        pageSize: { type: "integer", nullable: false, minimum: 1, default: 15, },
        page: { type: "integer", nullable: false, minimum: 1, default: 1, }
      },
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
