export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/survey-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '2+a(4fe1b5=b5b33e-75!3,5c3215cb'
}
