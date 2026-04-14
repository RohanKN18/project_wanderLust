import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}



import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderluste_DEV",
        allowed_formats: ["png", "jpg", "jpeg", "webp"],   // note: allowed_formats (with underscore)
        // You can add more if needed
    },
});

export { cloudinary, storage };