import { ethers } from "ethers";
import { contractABI } from "./contract/contractABI.js";

export const PORT = process.env.PORT || 8000;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_SECRET_EXPIRY =
  process.env.ACCESS_TOKEN_SECRET_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET_EXPIRY =
  process.env.REFRESH_TOKEN_SECRET_EXPIRY;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const ROLES = { USER: "USER", ADMIN: "ADMIN" };

//BLOCKCHAIN
export const CONTRACT_ABI = contractABI;
export const PROVIDER = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY, PROVIDER);
export const CONTRACT = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  CONTRACT_ABI,
  WALLET
);
