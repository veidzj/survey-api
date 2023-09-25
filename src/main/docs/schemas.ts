import {
  signUpParamsSchema,
  signInParamsSchema,
  accountSchema,
  errorSchema,
  surveySchema,
  surveysSchema,
  surveyAnswerSchema,
  addSurveyParamsSchema,
  saveSurveyParamsSchema,
  surveyResultSchema,
  surveyResultAnswerSchema
} from './schemas/'

export default {
  signUpParams: signUpParamsSchema,
  signInParams: signInParamsSchema,
  account: accountSchema,
  error: errorSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  surveyAnswer: surveyAnswerSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
