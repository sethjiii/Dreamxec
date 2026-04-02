const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath
 * @param {string} folder
 * @param {'image' | 'video' | 'raw'} resourceType
 */
module.exports = async function uploadToCloudinary(
  filePath,
  folder,
  resourceType = "auto"
) {
  try {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    };

    // --- ENFORCE IMAGE UPLOAD OPTIMIZATION (Max 800px) ---
    if (resourceType === "image") {
      uploadOptions.transformation = [
        { width: 800, crop: "limit" },
        { quality: "auto", fetch_format: "auto" }
      ];
    }

    const res = await cloudinary.uploader.upload(filePath, uploadOptions);

    fs.unlinkSync(filePath);
    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    // Ensure file is deleted from temp storage even if upload fails
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw new Error("Cloudinary upload failed");
  }
};
