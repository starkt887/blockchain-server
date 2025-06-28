import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateEmail, validateEmptyFiealds } from "../utils/validate.js";
import DB from "../db/index.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { encryptPassword } from "../utils/PasswordHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //get data from frontend
  //validate all data if empty
  //validate if email is in proper format
  //validate if the user exists
  //validate if the logo is provided
  //insert into db
  const { name, email, password, company, city, state, mobile } = req.body;
  if (
    validateEmptyFiealds([name, email, password, company, city, state, mobile])
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  if (validateEmail(email)) {
    throw new ApiError(400, "Valid email is required!");
  }

  const isUserRegistered = await DB.user.findUnique({
    where: { email: email },
  });
  console.log(isUserRegistered);

  if (isUserRegistered) {
    throw new ApiError(409, "Email already registered!");
  }

  const logoLocalPath = req.files?.logo[0]?.path;
  if (!logoLocalPath) {
    throw new ApiError(400, "Company logo required!");
  }

  const logoUrl = await uploadToCloudinary(logoLocalPath);
  if (!logoUrl) {
    throw new ApiError(400, "Company logo required!");
  }

  const encryptedPassword = await encryptPassword(password);

  const user = await DB.user.create({
    data: {
      name: name,
      email: email,
      password: encryptedPassword,
      company: company,
      logo: logoUrl,
      city: city,
      state: state,
      mobile: mobile,
    },
  });
  const createdUser = await DB.user.findUnique({
    where: { id: user.id },
    omit: { password: true, refreshToken: true },
  });
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user!");
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully!"));
});

export { registerUser };
