import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'

export default {
  Query: {
    async surveyResult (parent: any, args: any) {
      return await adaptResolver(makeLoadSurveyResultController(), args)
    }
  },

  Mutation: {
    async saveSurveyResult (parent: any, args: any) {
      return await adaptResolver(makeSaveSurveyResultController(), args)
    }
  }
}
