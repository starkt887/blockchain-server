import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateEmail, validateEmptyFiealds } from "../utils/validate.js";
import DB from "../db/index.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {
  encryptPassword,
  isPasswordCorrect,
} from "../utils/PasswordHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/JWTHandler.js";
const registerUser = asyncHandler(async (req, res) => {
  //get data from frontend
  //validate all data if empty
  //validate if email is in proper format
  //validate if the user exists
  //validate if the logo is provided
  //insert into db

  const { name, email, mobile, country, countryCode, password } = req.body;
  if (
    validateEmptyFiealds([name, email, mobile, country, countryCode, password])
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

  const encryptedPassword = await encryptPassword(password);
  const user = await DB.user.create({
    data: {
      name: name,
      email: email,
      mobile: mobile,
      country: country,
      countryCode: countryCode,
      password: encryptedPassword,
      enabled:true,//should be based on email verification
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
    .json(
      new ApiResponse(
        201,
        { userId: createdUser.id },
        "User registered successfully!"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  //get credentials from frontend
  //validate all the fields are present
  //validate if email is a valid email
  //validate if there is a registration with this email
  //validate the password using bcrypt compare
  //on success validation generate the access token and refresh token
  //create a response by removing the refresh token and password and send it to frontend
  //send cookie
  console.log(req.body);

  const { email, password } = req.body;
  if (validateEmptyFiealds([email, password])) {
    throw new ApiError(400, "All fields are required!");
  }
  if (validateEmail(email)) {
    throw new ApiError(400, "Valid email is required!");
  }
  const user = await DB.user.findFirst({ where: { email: email } });
  if (!user) {
    throw new ApiError(404, "User doesn't exists!");
  }
  if (!user.enabled) {
    throw new ApiError(401, "Your account is not activated!");
  }
  const isPasswordValid = await isPasswordCorrect(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials!");
  }
  try {
  } catch (error) {}
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = generateRefreshToken({ id: user.id });
  const refreshTokenUpdatedUser = await DB.user.update({
    data: {
      refreshToken,
    },
    where: { id: user.id },
    omit: { refreshToken, password },
  });
  if (!refreshTokenUpdatedUser) {
    throw new ApiError(400, "Unable to start sessions!");
  }
  const updateUser = await DB.user.findUnique({
    where: { id: user.id },
    include: { role: true },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          id: updateUser.id,
          smcAddress: updateUser.smcAddress,
          role: updateUser.role,
        },
        "Login successful!"
      )
    );
});

const getProfile = asyncHandler(async (req, res) => {
  //verify jwt
  //find the user using id
  const userId = req.user.id;
  const user = await DB.user.findUnique({
    where: { id: userId },
    omit: { refreshToken: true, password: true, quotations: true },
  });
  if (!user) {
    throw new ApiError(401, "Unable to find user profile!");
  }
  //response
  res.status(200).json(new ApiResponse(200, user, "User details are loaded!"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    company,
    country,
    countryCode,
    city,
    state,
    zipcode,
    mobile,
    smcAddress,
  } = req.body;
  console.log(req.body);

  const userId = req.user.id;
  if (
    validateEmptyFiealds([
      name,
      company,
      country,
      city,
      zipcode,
      state,
      mobile,
      countryCode,
      smcAddress,
    ])
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  let logoUrl = undefined;
  if (req.files && req.files?.logo) {
    // if (!req.files?.logo) {
    //   throw new ApiError(400, "Company logo required!");
    // }
    console.log("logo available");

    const logoLocalPath = req.files?.logo[0]?.path;
    logoUrl = await uploadToCloudinary(logoLocalPath);
    if (!logoUrl) {
      throw new ApiError(400, "Company logo upload failed!");
    }
  }

  const user = await DB.user.update({
    data: {
      name: name,
      company: company,
      logo: logoUrl && logoUrl,
      country: country,
      city: city,
      state: state,
      mobile: mobile,
      zipcode: zipcode,
      smcAddress: smcAddress,
    },
    where: { id: userId },
    omit: { password: true, refreshToken: true },
  });
  if (!user) throw new ApiError(400, "Unabled to update profile detail!");
  res
    .status(201)
    .json(new ApiResponse(201, user, "Profile updated successfully!"));
});

const logoutUser = asyncHandler(async (req, res) => {
  // const user=await DB.user.findUnique({where:{id:req.user.id}})
  const updatedUser = await DB.user.update({
    data: { refreshToken: undefined },
    where: { id: req.user.id },
  });
  if (!updatedUser) {
    throw new ApiError(500, "Unable to logout user!");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "No token found!");
    }
    const decodedToken = decodeRefreshToken(incomingRefreshToken);
    const user = await DB.user.findUnique({
      where: { id: decodedToken.id },
      omit: { password: true },
    });
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = generateRefreshToken({ id: user.id });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refresh success!"
        )
      );
  } catch (error) {
    new ApiError(401, "Invalid refresh token!");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword, confirmPassword } = req.body;
  if (validateEmptyFiealds([newPassword, oldPassword, confirmPassword])) {
    throw new ApiError(400, "All fields are required!");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(401, "New password and Confirma password are not same!");
  }
  const user = await DB.user.findUnique({ where: { id: req.user.id } });
  const isPasswordValid = await isPasswordCorrect(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password!");
  }
  const encryptedPassword = await encryptPassword(newPassword);
  const updatedUser = await DB.user.update({
    where: { id: user.id },
    data: { password: encryptedPassword },
  });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getProfile,
  updateProfile,
};
