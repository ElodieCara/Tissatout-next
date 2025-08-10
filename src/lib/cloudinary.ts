import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    secure: true, // force HTTPS
    // cloud_name, api_key, api_secret sont lus automatiquement depuis CLOUDINARY_URL
});

export default cloudinary;
