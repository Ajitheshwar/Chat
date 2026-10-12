import jwt from "jsonwebtoken";

export const issueToken = (user) => {
  console.log("Issuing token for user:", user.username);
  return jwt.sign(
    { id: user._id, name: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

export const issueRefreshToken = (user) => {
  console.log("Issuing refresh token for user:", user.username);
  return jwt.sign(
    { id: user._id, name: user.username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const setAuthCookie = (res, token, refreshToken) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
};
