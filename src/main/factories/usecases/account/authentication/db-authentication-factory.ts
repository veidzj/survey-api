import env from '@/main/config/env'
import { Authentication } from '@/domain/usecases/account/authentication'
import { DbAuthentication } from '@/data/usecases/db-authentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
