import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET_EXPIRY,
} from "../constants.js";
import ApiError from "./ApiError.js";
const generateAccessToken = (data) => {
  return jwt.sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_SECRET_EXPIRY,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_SECRET_EXPIRY,
  });
};
const decodeAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET, function (error, decoded) {
    if (error) {
      throw new ApiError(401, "Session expired. Please login again!");
    }
    return decoded;
  });
};
const decodeRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
// const dataToEncryptInAccessToken = {
//   id: 123,
//   email: "something@example.com",
//   name: "ramesh",
// };

// const dataToEncryptInRefreshToken = {
//   id: 123,
// };
export {
  generateAccessToken,
  generateRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
};
