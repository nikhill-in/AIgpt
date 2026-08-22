import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/jwt.helper.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_MAX_AGE = 80 * 24 * 60 * 60 * 1000; // 80 days

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

// Register User ============

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      status: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

// Login User ==============

export const login = async (req, res) => {
  console.log("Trying to Login...");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      status: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

// Update user ===============
export const updateUser = catchAsync(async (req, res) => {
  const allowedFields = ["name", "email", "role"];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    status: true,
    message: "User updated successfully",
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  });
});

// logout Controller ============

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", COOKIE_OPTS);
    res.clearCookie("refreshToken", COOKIE_OPTS);

    return res
      .status(200)
      .json({ status: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later",
    });
  }
};

// getMe Controller ================

export const getMe = catchAsync(async (req, res) => {
  console.log("this is req. user", req.user);
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json({
      success: true,
      message: Successfull,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
});

// getToken Controller ==============

export const getTokenOptions = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select("role proExpiresAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const TOKEN_OPTIONS = {
    user: [{ label: "Short" }, { label: "Standard" }],

    pro: [{ label: "Short" }, { label: "Standard" }, { label: "Extended" }],
  };

  const isPro =
    user.role === "pro" && user.proExpiresAt && user.proExpiresAt > new Date();

  const options = isPro ? TOKEN_OPTIONS.pro : TOKEN_OPTIONS.user;

  res.status(200).json({
    status: true,
    isPro,
    options,
  });
});
