import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

let config = {};

if (env === "development") {
  config = {
    mongo: {
      uri: process.env.DEV_MONGO_URI,
    },
    jwtSecret: process.env.DEV_JWT_SECRET,
    refreshSecret: process.env.DEV_REFRESH_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  };
} else if (env === "staging") {
  config = {
    mongo: {
      uri: process.env.STAGING_MONGO_URI,
    },
    jwtSecret: process.env.STAGING_JWT_SECRET,
    refreshSecret: process.env.STAGING_REFRESH_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  };
} else if (env === "production") {
  config = {
    mongo: {
      uri: process.env.PROD_MONGO_URI,
    },
    jwtSecret: process.env.PROD_JWT_SECRET,
    refreshSecret: process.env.PROD_REFRESH_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  };
}

export default {
  env,
  port: process.env.PORT,
  ...config,
};
