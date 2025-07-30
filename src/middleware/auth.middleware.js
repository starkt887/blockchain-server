import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { decodeAccessToken } from "../utils/JWTHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", ""));

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    console.log(token);
    try {
      
    } catch (error) {
      
    }
    const decodedToken = decodeAccessToken(token);
    const user = await DB.user.findUnique({
      where: { id: decodedToken.id },
      omit: { password: true, refreshToken: true },
    });

    
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
