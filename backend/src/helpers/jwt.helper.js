import jwt from "jsonwebtoken";
import config from "../config/env.config.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1m" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.refreshSecret, { expiresIn: "80d" }); // fixed: was jwtSecret
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") throw new Error("ACCESS_TOKEN_EXPIRED");
    if (error.name === "JsonWebTokenError") throw new Error("ACCESS_TOKEN_INVALID");
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.refreshSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") throw new Error("REFRESH_TOKEN_EXPIRED");
    if (error.name === "JsonWebTokenError") throw new Error("REFRESH_TOKEN_INVALID");
    throw error;
  }
};