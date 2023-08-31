import { Controller } from '../../../../presentation/protocols'
import { SignUpController } from '../../../../presentation/controllers/signin/signup/signup-controller'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
