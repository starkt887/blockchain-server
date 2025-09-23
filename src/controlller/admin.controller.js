import { ObjectId } from "bson";
import { ROLES, ROWS_LIMIT } from "../constants.js";
import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import req from "express/lib/request.js";
import { validateEmptyFiealds } from "../utils/validate.js";

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
  console.log(req.query);

  const roleDetails = await DB.roles.findFirst({
    where: { title: ROLES.USER },
  });
  if (!roleDetails) {
    throw new ApiError(401, "No User role found!");
  }
  const skip = (page - 1) * ROWS_LIMIT;
  let whereClause = {};
  let responseMsg = "";
  if (!query) {
    //normal data fetch
    whereClause = { roleId: roleDetails.id };
    responseMsg = "Fetched Company Data!";
  } else {
    //filtered data fetch
    let searchConditions = [
      { company: { startsWith: query, mode: "insensitive" } },
    ];
    if (ObjectId.isValid(query)) {
      searchConditions.push({ id: query });
    }
    whereClause = { OR: searchConditions, AND: { roleId: roleDetails.id } };
    responseMsg = "Search complete!";
  }
  console.log("ID valid:", ObjectId.isValid(query));

  const totalUsersMatchingQuery = await DB.user.findMany({
    where: whereClause,
    omit: { password: true, refreshToken: true },
  });
  console.log("totalUsers:", totalUsersMatchingQuery.length);

  const users = await DB.user.findMany({
    skip: skip,
    take: ROWS_LIMIT,
    where: whereClause,
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
        responseMsg
      )
    );
});

const getCompanyProfileById = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  console.log("Profile ID:",profileId);
  
  if (!profileId) {
    throw new ApiError(401, "Profile ID is missing!");
  }

  const companyProfile = await DB.user.findFirst({
    where: { id: profileId },
    omit: { password: true, refreshToken: true },
  });
  if (!companyProfile) {
    throw new ApiError(401, "Company Profile not found!");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        companyProfile,
        `Fetched ${companyProfile.company} Profile!`
      )
    );
});

const updateProfileAsAdmin = asyncHandler(async (req, res) => {
  const {
    userId,
    name,
    company,
    country,
    countryCode,
    city,
    state,
    zipcode,
    mobile,
    smcAddress,
  } = req.body;
  console.log(req.body);


  if (
    validateEmptyFiealds([
      userId,
      name,
      company,
      country,
      city,
      zipcode,
      state,
      mobile,
      countryCode,
      smcAddress,
    ])
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  let logoUrl = undefined;
  if (req.files && req.files?.logo) {
    // if (!req.files?.logo) {
    //   throw new ApiError(400, "Company logo required!");
    // }
    console.log("logo available");

    const logoLocalPath = req.files?.logo[0]?.path;
    logoUrl = await uploadToCloudinary(logoLocalPath);
    if (!logoUrl) {
      throw new ApiError(400, "Company logo upload failed!");
    }
  }

  const user = await DB.user.update({
    data: {
      name: name,
      company: company,
      logo: logoUrl && logoUrl,
      country: country,
      city: city,
      state: state,
      mobile: mobile,
      zipcode: zipcode,
      smcAddress: smcAddress,
    },
    where: { id: userId },
    omit: { password: true, refreshToken: true },
  });
  if (!user) throw new ApiError(400, "Unabled to update profile detail!");
  res
    .status(201)
    .json(new ApiResponse(201, user, "Profile updated successfully!"));
});


const getMyQuotationRequests = asyncHandler(async (req, res) => {
  //get page no
  //get the user
  //get quotations
  //   console.log(req.params);

  const { page } = req.params;

  console.log(page);

  if (!validateIsNumber(page)) {
    throw new ApiError(400, "Invalid page no!");
  }
  const user = req.user;
  const quotations = await fetchQuotations(user.id, page);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...quotations },
        "Loaded all your quotation requests!"
      )
    );
});

export { getAllCompanies, searchUsersByIDorCompanyName,getCompanyProfileById,updateProfileAsAdmin };
