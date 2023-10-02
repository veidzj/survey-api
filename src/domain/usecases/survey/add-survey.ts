export interface AddSurvey {
  add: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = {
    question: string
    answers: SurveyAnswerModel[]
    date: Date
    didAnswer?: boolean
  }

  type SurveyAnswerModel = {
    answer: string
    image?: string
  }
}
