const TOKEN_LIMITS = {
  Short: 700,
  Standard: 2200,
  Extended: 3000,
};

export const getTokenSize = (tSize, role) => {
  const tokenSize = TOKEN_LIMITS[tSize];

  if (!tokenSize) {
    throw new ApiError(400, "Invalid token size");
  }

  if (tSize === "Extended" && role !== "pro") {
    throw new ApiError(
      403,
      "Extended token size is available only for Pro users"
    );
  }

  return tokenSize;
};