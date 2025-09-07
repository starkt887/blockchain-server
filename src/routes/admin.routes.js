import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getAllCompanies,
  getCompanyProfileById,
  searchUsersByIDorCompanyName,
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
//get all requests
//update requets
//approve quotation requests
export default router;
