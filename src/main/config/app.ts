import express from 'express'
import setupApolloServer from './apollo-server'
import setupSwagger from './swagger'
import setupStaticFiles from './static-files'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()
setupApolloServer(app)
setupSwagger(app)
setupStaticFiles(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
