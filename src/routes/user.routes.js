import { Router } from "express";
import { registerUser } from "../controlller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { attachRoleToRequest } from "../middleware/attachRoleToRequest.middleware.js";
import { ROLES } from "../constants.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  attachRoleToRequest(ROLES.USER),
  registerUser
);
export default router;
