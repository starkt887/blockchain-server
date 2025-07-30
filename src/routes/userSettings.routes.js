import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addAPIKeys,
  getMyApiKeys,
  getMyQuotationRequests,
  quotationRequest,
  toggleAPIKeys,
} from "../controlller/userSettings.controller.js";

const router = Router();

//send quotation request
router.route("/quotation-request").post(verifyJWT, quotationRequest);
router
  .route("/getMyQuotationRequests/:page")
  .get(verifyJWT, getMyQuotationRequests);
//create new api keys
router.route("/add-apikeys").post(verifyJWT, addAPIKeys);
router.route("/getMyApiKeys").get(verifyJWT, getMyApiKeys);
router.route("/toggleApiKeys").post(verifyJWT, toggleAPIKeys);

export default router;
