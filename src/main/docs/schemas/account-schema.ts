export const accountSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    accessToken: {
      type: 'string'
    }
  },
  required: ['name', 'accessToken']
}
