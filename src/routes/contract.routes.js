import express from "express";
import {
  generatecertificates,
  getValue,
  setValue,
} from "../controlller/contract.controller.js";
import { verifyApiKeys } from "../middleware/authApiKeys.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Example read function
router.route("/getValue").get(getValue);

// Example write function
router.route("/setValue").post(setValue);

router
  .route("/generateCertificate")
  .post(verifyJWT, verifyApiKeys, generatecertificates);

//get my requests
//generate certificate request
//check certificate request status and if done then send certificate
//fetch certificate

export default router;
