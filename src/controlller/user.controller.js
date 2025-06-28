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

  const {
    name,
    email,
    password,
    company,
    country,
    city,
    state,
    zipcode,
    mobile,
  } = req.body;
  if (
    validateEmptyFiealds([
      name,
      email,
      password,
      company,
      country,
      city,
      zipcode,
      state,
      mobile,
    ])
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  if (validateEmail(email)) {
    throw new ApiError(400, "Valid email is required!");
  }

  const isUserRegistered = await DB.user.findFirst({
    where: { email: email },
  });

  if (isUserRegistered) {
    console.log(isUserRegistered);
    throw new ApiError(409, "Email already registered!");
  }

  if (!req.files?.logo) {
    throw new ApiError(400, "Company logo required!");
  }
  const logoLocalPath = req.files?.logo[0]?.path;
  const logoUrl = await uploadToCloudinary(logoLocalPath);
  if (!logoUrl) {
    throw new ApiError(400, "Company logo upload failed!");
  }

  const encryptedPassword = await encryptPassword(password);

  const user = await DB.user.create({
    data: {
      name: name,
      email: email,
      password: encryptedPassword,
      company: company,
      logo: logoUrl,
      country: country,
      city: city,
      state: state,
      mobile: mobile,
      zipcode: zipcode,
      role: {
        connect: { id: req.role.id },
      },
    },
    include: { role: true },
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
