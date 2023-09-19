import { signInPath } from './paths/signin-path'
import { accountSchema } from './schemas/account-schema'
import { signInParamsSchema } from './schemas/signin-params-schema'
import { errorSchema } from './schemas/error-schema'
import { badRequest, unauthorized, notFound, serverError } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API using TypeScript, TDD and Clean Architecture',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Sign In'
  }],
  paths: {
    '/signin': signInPath
  },
  schemas: {
    account: accountSchema,
    signInParams: signInParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    notFound,
    serverError
  }
}
