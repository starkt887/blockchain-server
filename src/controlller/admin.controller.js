import { ObjectId } from "bson";
import { ROLES, ROWS_LIMIT, STATUS } from "../constants.js";
import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import req from "express/lib/request.js";
import { validateEmptyFiealds } from "../utils/validate.js";
import { fetchQuotations } from "../db/utils/quotations.js";

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
  console.log("Profile ID:", profileId);

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



const getQuotationsById = asyncHandler(async (req, res) => {
  const { profileId, page } = req.query;
  console.log("Profile ID-Page:", profileId, page);

  if (!profileId) {
    throw new ApiError(401, "Profile ID is missing!");
  }

  const quotations = await fetchQuotations(profileId, page);
  if (!quotations) {
    throw new ApiError(401, "Quotations not found!");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { ...quotations }, `Fetched Quotations!`));
});

const updateQuotationRequests = asyncHandler(async (req, res) => {
  const { profileId, quotationId, status } = req.body;
  if (!profileId) {
    throw new ApiError(401, "Profile id is missing!");
  }
  if (!quotationId) {
    throw new ApiError(400, "Quotation id is missing!");
  }
  if (!status) {
    throw new ApiError(400, "Status is missing!");
  }
  const quoteRequest = await DB.quotations.findFirst({
    where: { id: quotationId },
  });
  if (!quoteRequest) {
    throw new ApiError(500, "Unable to find quotation request");
  }
  if (status.toUpperCase() === STATUS.APPROVED) {
    const addQuotations = await DB.user.update({
      data: {
        quotations: {
          increment: quoteRequest.quotation,
        },
      },
      where: { id: profileId },
    });
    if (!addQuotations) {
      throw new ApiError(500, "Unable to update quotations");
    }
  }

  const updatedQuotationRecord = await DB.quotations.update({
    data: {
      status:
        status.toUpperCase() === STATUS.APPROVED
          ? STATUS.APPROVED
          : STATUS.REJECTED,
    },
    where: { id: quotationId },
  });
  console.log(updatedQuotationRecord);
  if (!updatedQuotationRecord) {
    throw new ApiError(401, "Unable to update the status");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Quotation request of ${quoteRequest.quotation} has ${status} successfully!`
      )
    );
});

export {
  getAllCompanies,
  searchUsersByIDorCompanyName,
  getCompanyProfileById,
  getQuotationsById,
  updateQuotationRequests,
  updateProfileAsAdmin
};
