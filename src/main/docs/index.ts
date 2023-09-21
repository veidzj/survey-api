import paths from './paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API using TypeScript, TDD and Clean Architecture',
    version: '1.0.0'
  },
  license: {
    name: 'GNU General Public License v3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Sign In'
  }, {
    name: 'Survey'
  }],
  paths,
  schemas,
  components
}
