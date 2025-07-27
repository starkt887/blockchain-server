import { Router } from "express";
import {
  changePassword,
  getProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateProfile,
} from "../controlller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { attachRoleToRequest } from "../middleware/attachRoleToRequest.middleware.js";
import { ROLES } from "../constants.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(attachRoleToRequest(ROLES.USER), registerUser);
router.route("/login").post(loginUser);

//secured routes
//logout
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-tokens").post(refreshAccessToken);

//change password
router.route("/change-password").post(verifyJWT,changePassword);

//get single user data
router.route("/get-profile").get(verifyJWT, getProfile);

//update profile
router.route("/update-profile").post(
  verifyJWT,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  updateProfile
);


//admin routes
//get all users
export default router;
