import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    async surveys (parent: any, args: any, context: any) {
      return await adaptResolver(makeLoadSurveysController(), args, context)
    }
  }
}
