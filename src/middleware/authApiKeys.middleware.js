import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isApiSecretCorrect } from "../utils/PasswordHandler.js";

export const verifyApiKeys = asyncHandler(async (req, res, next) => {
  try {
    const apiKey = req.header("api-key") && req.header("api-key");
    const apiSecret = req.header("api-secret") && req.header("api-secret");

    if (!apiKey || !apiSecret) {
      throw new ApiError(402, "Unauthorized Certification request");
    }
    // console.log(apiKey, apiSecret);
    // verify api key and secret
    const user = req.user;
    const userApiKeys = await DB.apiKeys.findFirst({
      where: { AND: [{ userId: user.id }, { apiKey: apiKey }] },
    });
    if (!userApiKeys.enabled) {
      throw new ApiError(
        401,
        "API key disabled. Please enable and request again!"
      );
    }
    if (!userApiKeys) {
      throw new ApiError(401, "Invalid API key");
    }
    if (!isApiSecretCorrect(userApiKeys.apiSecret, apiSecret)) {
      throw new ApiError(401, "Invalid API secret");
    }
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
