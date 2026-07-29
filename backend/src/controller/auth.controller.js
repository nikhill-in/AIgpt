import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt.helper.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;           // 15 min
const REFRESH_TOKEN_MAX_AGE = 80 * 24 * 60 * 60 * 1000; // 80 days

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, { ...COOKIE_OPTS, maxAge: ACCESS_TOKEN_MAX_AGE });
  res.cookie("refreshToken", refreshToken, { ...COOKIE_OPTS, maxAge: REFRESH_TOKEN_MAX_AGE });
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      status: true,
      message: "Registered successfully",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Something went wrong. Please try again later" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      status: true,
      message: "Logged in successfully",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Something went wrong. Please try again later" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", COOKIE_OPTS);
    res.clearCookie("refreshToken", COOKIE_OPTS);

    return res.status(200).json({ status: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Something went wrong. Please try again later" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res.status(200).json({ status: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Something went wrong. Please try again later" });
  }
};