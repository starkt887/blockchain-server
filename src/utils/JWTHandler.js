import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET_EXPIRY,
} from "../constants";
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
// const dataToEncryptInAccessToken = {
//   id: 123,
//   email: "something@example.com",
//   name: "ramesh",
// };

// const dataToEncryptInRefreshToken = {
//   id: 123,
// };
export { generateAccessToken, generateRefreshToken };
