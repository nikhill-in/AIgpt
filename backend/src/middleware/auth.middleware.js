import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../helpers/jwt.helper.js";

const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.cookies.auth;

    const accessToken =
      auth?.accessToken || req.headers.authorization?.split(" ")[1];

    const refreshToken =
      auth?.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        status: false,
        message: "Please login to continue",
      });
    }

    try {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded;

      return next();
    } catch (error) {
      if (error.message !== "ACCESS_TOKEN_EXPIRED") {
        return res.status(401).json({
          status: false,
          message: "Your session is not valid. Please login again",
        });
      }

      if (!refreshToken) {
        return res.status(401).json({
          status: false,
          message: "Your session has expired. Please login again",
        });
      }

      try {
        const decodedRefresh = verifyRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken({
          id: decodedRefresh.id,
        });

        res.cookie(
          "auth",
          {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
          },
          {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
            path: "/",
          },
        );

        req.user = decodedRefresh;

        return next();
      } catch (refreshError) {
        return res.status(403).json({
          status: false,
          message: "Your session has ended. Please login again",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again later",
    });
  }
};
 
export default authMiddleware;

