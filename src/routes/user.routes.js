import { Router } from "express";
import { registerUser } from "../controlller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  registerUser
);
export default router;
