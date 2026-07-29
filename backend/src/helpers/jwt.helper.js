import jwt from "jsonwebtoken";
import config from "../config/env.config.js";

/**
 * Generate Access Token (Short Life)
 */
export const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "80d",
  });

  return token;
};

export const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "80d",
  });

  return token;
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("ACCESS_TOKEN_EXPIRED");
    }

    if (error.name === "JsonWebTokenError") {
      throw new Error("ACCESS_TOKEN_INVALID");
    }

    throw error;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.refreshSecret);

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    if (error.name === "JsonWebTokenError") {
      throw new Error("REFRESH_TOKEN_INVALID");
    }

    throw error;
  }
};
