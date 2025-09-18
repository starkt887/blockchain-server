import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getAllCompanies,
  getCompanyProfileById,
  getQuotationsById,
  searchUsersByIDorCompanyName,
  updateQuotationRequests,
} from "../controlller/admin.controller.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = Router();
//register
//login
//get all users
router.route("/getAllCompanies/:page").get(verifyJWT, isAdmin, getAllCompanies);
//search company by id or company name
router
  .route("/searchCompanyByIDorName")
  .post(verifyJWT, isAdmin, searchUsersByIDorCompanyName);

//get company profile
router
  .route("/get-profile-byid/:profileId")
  .get(verifyJWT, isAdmin, getCompanyProfileById);
//get quotations
router
  .route("/get-quotations-byid")
  .post(verifyJWT, isAdmin, getQuotationsById);
//get all requests
//update requets
//approve/reject quotation requests
router
  .route("/updateQuotationRequests")
  .post(verifyJWT, isAdmin, updateQuotationRequests);
export default router;
