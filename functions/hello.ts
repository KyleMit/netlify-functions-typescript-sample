import { Handler } from '@netlify/functions'

const handler: Handler = async (event, context) => {

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "All Gone" })
  }
}

export { handler }
