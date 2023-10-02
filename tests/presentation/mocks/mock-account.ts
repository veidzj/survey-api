import faker from 'faker'
import { AccountModel, AuthenticationModel } from '@/domain/models'
import { AddAccount, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  isValid: boolean = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return await Promise.resolve(this.isValid)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel: AuthenticationModel = {
    name: faker.name.findName(),
    accessToken: faker.random.uuid()
  }

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authenticationParams
    return await Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.accountModel)
  }
}
