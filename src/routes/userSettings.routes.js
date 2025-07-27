import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getMyQuotationRequests, quotationRequest } from "../controlller/userSettings.controller.js";

const router=Router()

//send quotation request
router.route("/quotation-request").post(verifyJWT,quotationRequest)
router.route("/getMyQuotationRequests/:page").get(verifyJWT,getMyQuotationRequests)
//create new api keys

export default router