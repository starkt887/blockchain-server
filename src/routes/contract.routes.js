import express from "express";
import { getValue, setValue } from "../controlller/contract.controller.js";

const router = express.Router();

// Example read function
router.route("/getValue").get(getValue);

// Example write function
router.route("/setValue").post(setValue);

//get my requests
//generate certificate request
//check certificate request status and if done then send certificate
//fetch certificate

export default router;
