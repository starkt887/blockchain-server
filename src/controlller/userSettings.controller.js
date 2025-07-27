import { ROWS_LIMIT, STATUS } from "../constants.js";
import DB from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateIsNumber } from "../utils/validate.js";

const fetchQuotations = async (userId, page = 1) => {
  const skip = (page - 1) * ROWS_LIMIT;
  const totalQuotations = await DB.quotations.count({
    where: { userId: userId },
  });
  const quotationRequests = await DB.quotations.findMany({
    skip,
    take: ROWS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
    where: { userId: userId },
    omit: { userId: true, updatedAt: true },
  });
  return { quotationRequests, totalQuotations };
};

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

export { quotationRequest, getMyQuotationRequests };
