import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/signin/signup/signup-controller-factory'
import { makeSignInController } from '../factories/controllers/signin/signin/signin-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/signin', adaptRoute(makeSignInController()))
}
