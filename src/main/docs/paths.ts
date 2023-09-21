import { signUpPath, signInPath, surveyPath, surveyResultPath } from './paths/'

export default {
  '/signup': signUpPath,
  '/signin': signInPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
