import faker from 'faker'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'

export class AddAccountSpy implements AddAccount {
  accountModel: AccountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account
    return Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  token: string = faker.random.uuid()
  authenticationParams: AuthenticationParams

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    this.authenticationParams = authenticationParams
    return Promise.resolve(this.token)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}
