export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}

type SurveyResultAnswerModel = {
  answer: string
  image?: string
  count: number
  percent: number
}
