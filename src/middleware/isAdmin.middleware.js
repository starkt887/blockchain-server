import { ROLES } from "../constants.js";
import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const role = req.user.role;
  const adminRoleDetails = await DB.roles.findFirst({
    where: { title: ROLES.ADMIN },
  });
  if (role.id !== adminRoleDetails.id) {
    throw new ApiError(400, "You are not autorized to access these details!");
  }
  next();
});
