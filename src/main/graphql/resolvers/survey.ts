import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories'

export default {
  Query: {
    async surveys () {
      return await adaptResolver(makeLoadSurveysController())
    }
  }
}
