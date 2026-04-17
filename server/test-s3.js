require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const uploadToS3 = require("./src/utils/uploadToS3");

async function runTest() {
  const dummyFilePath = path.join(__dirname, "dummy-test-file.txt");
  
  // 1. Create a dummy file
  await fs.writeFile(dummyFilePath, "Hello, this is a test file for S3 upload!");
  console.log("Created dummy file at", dummyFilePath);

  // 2. Fake a multer file object
  const dummyFileObj = {
    path: dummyFilePath,
    originalname: "dummy-test-file.txt",
    mimetype: "text/plain",
  };

  try {
    console.log("Uploading to S3...");
    const resultUrl = await uploadToS3(dummyFileObj, "dreamxec/test");
    
    if (resultUrl) {
      console.log("✅ Successfully uploaded! S3 URL:", resultUrl);
    } else {
      console.log("❌ Failed to upload. URL is null.");
    }
  } catch (err) {
    console.error("Test encountered an error:", err);
  }
}

runTest();
