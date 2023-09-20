import { signInPath, surveyPath } from './paths'
import { accountSchema, signInParamsSchema, errorSchema, surveyAnswerSchema, surveySchema, surveysSchema, apiKeyAuthSchema } from './schemas'
import { badRequest, unauthorized, forbidden, notFound, serverError } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API using TypeScript, TDD and Clean Architecture',
    version: '1.0.0'
  },
  license: {
    name: 'GNU General Public License v3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Sign In'
  }, {
    name: 'Survey'
  }],
  paths: {
    '/signin': signInPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    signInParams: signInParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError
  }
}