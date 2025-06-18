import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../constants";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //Upload local file
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(uploadResult);
    //Optimize the image
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });
    console.log(optimizeUrl);
    return optimizeUrl;
  } catch (error) {
    console.error("Cloudinary error:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadToCloudinary };

/*
// Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      }
    )
    .catch((error) => {
      console.log(error);
    });

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);

  */
