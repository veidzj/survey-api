import express from 'express'
import setupSwagger from './config-swagger'
import setupStaticFiles from './static-files'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()
setupSwagger(app)
setupStaticFiles(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
