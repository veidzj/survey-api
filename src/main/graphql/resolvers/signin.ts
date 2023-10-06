import { adaptResolver } from '@/main/adapters'
import { makeSignInController } from '@/main/factories'

export default {
  Query: {
    async signIn (parent: any, args: any) {
      return await adaptResolver(makeSignInController(), args)
    }
  }
}
