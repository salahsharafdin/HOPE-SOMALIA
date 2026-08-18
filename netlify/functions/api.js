const serverless = require('serverless-http');
const app = require('../../server/src/app');

// Export serverless handler for Netlify
const handler = serverless(app);

exports.handler = async (event, context) => {
  // Ensure serverless doesn't hang waiting for empty event loop
  context.callbackWaitsForEmptyEventLoop = false;
  return await handler(event, context);
};
