import { nanoid } from "nanoid";
import { COMPANY_TITLE, ROWS_LIMIT, STATUS } from "../constants.js";
import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateEmptyFiealds, validateIsNumber } from "../utils/validate.js";
import { encryptApiSecret, encryptPassword } from "../utils/PasswordHandler.js";
import { fetchQuotations } from "../db/utils/quotations.js";


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
const quotationRequest = asyncHandler(async (req, res) => {
  //get quotation request
  //validate if quotation request is a number
  //add new request in quotation collection
  //send response with all the quotations
  //   console.log(req.body);

  const { quotation } = req.body;
  const user = req.user;
  if (!validateIsNumber(quotation)) {
    throw new ApiError(400, "Invalid quotation value!");
  }
  const quotationAdded = await DB.quotations.create({
    data: {
      quotation: quotation,
      status: STATUS.PENDING,
      user: {
        connect: { id: user.id },
      },
    },
    include: { user: true },
  });
  if (!quotationAdded) {
    throw new ApiError(
      500,
      "Something went wrong while add quotation request!"
    );
  }
  const updatedQuotations = await fetchQuotations(user.id);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...updatedQuotations },
        "Quotation request added successfully!"
      )
    );
});

const fetchApiKeys = async (userId) => {
  const apiKeys = await DB.apiKeys.findMany({
    where: { userId: userId },
  });
  return apiKeys;
};
const getMyApiKeys = asyncHandler(async (req, res) => {
  const user = req.user;
  const apiKeys = await fetchApiKeys(user.id);
  if (!apiKeys) {
    res.status(200).json(new ApiResponse(200, {}, "No Api Keys found!"));
  }
  res.status(200).json(new ApiResponse(200, apiKeys, "Loaded your Api Keys!"));
});

const addAPIKeys = asyncHandler(async (req, res) => {
  //get the all the payload ()
  //generate the apikey and apisecret
  //find the record if already created for the user
  //update the record
  //or insert new record for new user
  //call the getMyApiKeys
  const { title } = req.body;
  const user = req.user;
  const apiKey = `${COMPANY_TITLE}_${title}_key`;
  const apiSecret = await encryptApiSecret(nanoid(20));
  const apiRecord = await DB.apiKeys.findFirst({
    where: { userId: user.id },
  });
  console.log(apiRecord);
  if (apiRecord) {
    const deleteRecord = await DB.apiKeys.delete({
      where: { id: apiRecord.id },
    });
  }

  const addNew_record = await DB.apiKeys.create({
    data: {
      title: title,
      apiKey: apiKey,
      apiSecret: apiSecret,
      enabled: false,
      user: {
        connect: { id: user.id },
      },
    },
    include: {
      user: true,
    },
  });

  if (!addNew_record) {
    throw new ApiError(500, "Unable to update Api Key");
  }
  const apiKeys = await fetchApiKeys(user.id);
  res
    .status(200)
    .json(new ApiResponse(200, apiKeys, "Loaded all your Api Keys"));
});

const toggleAPIKeys = asyncHandler(async (req, res) => {
  const { id: apiKeyId, state } = req.body;
  console.log(req.body);

  if (!apiKeyId) {
    throw new ApiError(401, "API key id required!");
  }
  const toggledApiKeyRecord = await DB.apiKeys.update({
    data: { enabled: state },
    where: { id: apiKeyId },
  });
  if (!toggledApiKeyRecord) {
    throw new ApiError(500, `Unable to ${state} Api Key!`);
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `APi key is ${state ? "Activated!" : "Dea-activated"}`
      )
    );
});

const approveQuotationRequest = asyncHandler(async (req, res) => {
  const { quotationRequestId, quotationAmt, userId, status } = req.body;
  if (!quotationAmt) {
    throw new ApiError(400, "Quotation Amount is Invalid!");
  }
  if (validateEmptyFiealds([quotationRequestId, userId, status])) {
    throw new ApiError(400, "requestId or userId is missing!");
  }
  if (status === STATUS.REJECTED) {
    const updatedRecord = await DB.quotations.update({
      data: { status: status },
      where: { id: quotationRequestId },
    });
    if (!updatedRecord) {
      throw new ApiError(500, "Unable to update quotation");
    }
    res
      .status(200)
      .json(new ApiResponse(200, updatedRecord, "Quotation rejected!"));
  }

  if (status === STATUS.APPROVED) {
    const updatedRecord = await DB.quotations.update({
      data: { status: status, quotation: { increment: quotationAmt } },
      where: { id: quotationRequestId },
    });
    if (!updatedRecord) {
      throw new ApiError(500, "Unable to update quotation");
    }
    res
      .status(200)
      .json(new ApiResponse(200, updatedRecord, "Quotation approved!"));
  }
});
export {
  quotationRequest,
  getMyQuotationRequests,
  getMyApiKeys,
  addAPIKeys,
  toggleAPIKeys,
  approveQuotationRequest
};
