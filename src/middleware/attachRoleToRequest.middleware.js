import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";

export const attachRoleToRequest = (title) => {
  return async (req, res, next) => {
    try {
      const roleDetails = await DB.roles.findUnique({
        where: { title: title },
      });
      if (!roleDetails) {
        throw new ApiError(500, "Unable to fetch role details");
      }
      console.log(roleDetails);
      
      req.role = roleDetails;
      next();
    } catch (error) {
      next(error);
    }
  };
};
