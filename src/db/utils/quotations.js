import { ROWS_LIMIT } from "../../constants.js";
import DB from "../index.js";

export const fetchQuotations = async (userId, page = 1) => {
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
