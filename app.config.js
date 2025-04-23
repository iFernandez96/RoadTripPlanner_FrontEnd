// const path = require('path');
// const dotenv = require('dotenv');

// const envPath = process.env.ENV_FILE
//   ? path.resolve(process.env.ENV_FILE)
//   : path.resolve('.env');

// const env = dotenv.config({ path: envPath }).parsed || {};

// export default {
//   expo: {
//     name: "RoadTripPlanner",
//     extra: {
//       apiUrl: env.API_URL,
//       apiKey: env.API_KEY,
//       environment: process.env.NODE_ENV || 'development',
//     },
//   },
// };

const path = require('path');
const dotenv = require('dotenv');

const envPath = process.env.ENV_FILE
  ? path.resolve(process.env.ENV_FILE)
  : path.resolve('.env');

const env = dotenv.config({ path: envPath }).parsed || {};

export default {
  expo: {
    name: "RoadTripPlanner",
    slug: "RoadTripPlanner",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: env.GOOGLE_MAPS_API_KEY || ''
        }
      },
      permissions: ["ACCESS_FINE_LOCATION"]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiUrl: env.API_URL,
      apiKey: env.API_KEY,
      environment: process.env.NODE_ENV || 'development',
    }
  }
};
