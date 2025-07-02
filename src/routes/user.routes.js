import { Router } from "express";
import { changePassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controlller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { attachRoleToRequest } from "../middleware/attachRoleToRequest.middleware.js";
import { ROLES } from "../constants.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
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
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-tokens").post(refreshAccessToken)
router.route("/change-password").post(changePassword)
//update profile

//admin routes
//get all users
//get single user data

export default router;
