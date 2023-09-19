import { signInPath } from './paths'
import { accountSchema, signInParamsSchema, errorSchema } from './schemas'
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
