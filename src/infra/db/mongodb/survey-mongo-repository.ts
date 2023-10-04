import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '@/infra/db'
import { AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository } from '@/data/protocols/db'
import { SurveyModel } from '@/domain/models'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveysResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()
    const surveys = await surveysCollection.aggregate(query).toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({
      _id: new ObjectId(id)
    }, {
      projection: {
        _id: 1
      }
    })
    return survey != null
  }
}
