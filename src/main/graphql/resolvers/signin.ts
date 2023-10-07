import { adaptResolver } from '@/main/adapters'
import { makeSignInController, makeSignUpController } from '@/main/factories'

export default {
  Query: {
    async signIn (parent: any, args: any) {
      return await adaptResolver(makeSignInController(), args)
    }
  },

  Mutation: {
    async signUp (parent: any, args: any) {
      return await adaptResolver(makeSignUpController(), args)
    }
  }
}
