import { ROLES, ROWS_LIMIT } from "../constants.js";
import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllCompanies = asyncHandler(async (req, res) => {
  //verify jwt
  //verify admin
  //get all the users with role user
  //check if there is atleast 1 user
  //send response
  const { page } = req.params;
  const roleDetails = await DB.roles.findFirst({
    where: { title: ROLES.USER },
  });

  if (!roleDetails) {
    throw new ApiError(401, "No User role found!");
  }
  const skip = (page - 1) * ROWS_LIMIT;
  const totalUsers = await DB.user.findMany({
    where: { roleId: roleDetails.id },
  });
  const users = await DB.user.findMany({
    skip,
    take: ROWS_LIMIT,
    where: { roleId: roleDetails.id },
    omit: { password: true, refreshToken: true },
  });
  console.log(users);

  if (!users) {
    throw new ApiError(400, "No companies registered!");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, totalUserCount: totalUsers.length },
        "Loaded the registered companies!"
      )
    );
});

const searchUsersByIDorCompanyName = asyncHandler(async (req, res) => {
  const { query, page } = req.query;
  const roleDetails = await DB.roles.findFirst({
    where: { title: ROLES.USER },
  });

  if (!roleDetails) {
    throw new ApiError(401, "No User role found!");
  }
  const skip = (page - 1) * ROWS_LIMIT;
  const totalUsersMatchingQuery = await DB.user.findMany({
    where: {
      OR: [
        { roleId: { equals: query, mode: "insensitive" } },
        { company: { startsWith: query, mode: "insensitive" } },
      ],
    },
    omit: { password: true, refreshToken: true },
  });
  const users = await DB.user.findMany({
    skip,
    take: ROWS_LIMIT,
    where: {
      OR: [
        { roleId: { equals: query, mode: "insensitive" } },
        { company: { startsWith: query, mode: "insensitive" } },
      ],
    },
    omit: { password: true, refreshToken: true },
  });
  if (!users) {
    throw new ApiError(400, "No companies found!");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, totalUserCount: totalUsersMatchingQuery.length },
        "Search complete!"
      )
    );
});

export { getAllCompanies, searchUsersByIDorCompanyName };
