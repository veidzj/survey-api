import { apiKeyAuthSchema } from './schemas/'
import { badRequest, unauthorized, forbidden, notFound, serverError } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError
}
