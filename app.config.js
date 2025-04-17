const path = require('path');
const dotenv = require('dotenv');

const envPath = process.env.ENV_FILE
  ? path.resolve(process.env.ENV_FILE)
  : path.resolve('.env');

const env = dotenv.config({ path: envPath }).parsed || {};

export default {
  expo: {
    name: "RoadTripPlanner",
    extra: {
      apiUrl: env.API_URL,
      apiKey: env.API_KEY,
      environment: process.env.NODE_ENV || 'development',
    },
  },
};