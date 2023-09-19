export const signInPath = {
  post: {
    tags: ['Sign In'],
    summary: 'Authenticate user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signInParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      }
    }
  }
}
