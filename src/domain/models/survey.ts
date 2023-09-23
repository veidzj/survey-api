export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

type SurveyAnswerModel = {
  answer: string
  image?: string
}
