import { adaptResolver } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/factories'

export default {
  Query: {
    async login (parent: any, args: any) {
      return await adaptResolver(makeLoginController(), args)
    }
  },

  Mutation: {
    async signUp (parent: any, args: any) {
      return await adaptResolver(makeSignUpController(), args)
    }
  }
}
