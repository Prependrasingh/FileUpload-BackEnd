const File = require("../models/file");
const cloudinary = require("cloudinary").v2;

// localFileUpload -> function handler

exports.localFileUpload = async (req, res) => {
  try {
    // fetch file
    const file = req.files.file;
    console.log("File aa gyi jii -> ", file);
    // const date = new Date();
    let path =
      __dirname + "/files/" + Date.now() + "-" + `.${file.name.split(".")[1]}`;
    console.log("PATH->", path);
    file.mv(path, (error) => {
      if (error) {
        console.log(error, "Error aa gya bhaiya!");
      }
    });

    res.status(200).json({
      success: true,
      message: "Local File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error aa gya bhaiya dobara!",
    });
  }
};

// image upload handler

// file type support checking function

function isfileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

// image upload to cloudinary function
async function UploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  options.resource_type = "auto";
  options.fetch_format = "auto";
  if (quality) {
    options.quality = quality; // ← use the actual value passed in, not hardcoded "auto"
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const files = req.files.imageFile;
    console.log(files);

    const supportedTypes = ["jpg", "jpeg", "png", "pdf"];
    const fileType = files.name.split(".")[1].toLowerCase();

    // validation

    if (!isfileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported Please Upload supported file type",
      });
    }

    // file type supported

    const response = await UploadFileToCloudinary(files, "MyData");
    console.log(response);

    // db mai entry create karni hai
    const fileData = await File.create({
      name,
      email,
      tags,
      imageUrl: response.secure_url,
    });

    return res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Data Uplaoded SuccessFully on cloudinary",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error during image uploading",
    });
  }
};

// video upload handler

exports.videoUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const files = req.files.videoFile;
    console.log(files);
    console.log("Controller hit");

    const fileType = files.name.split(".")[1].toLowerCase();

    const supportedTypes = ["mp4", "mov", "avi", "webm"];
    if (!isfileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "Video format not supported please use supported format",
      });
    }

    const response = await UploadFileToCloudinary(files, "MyData");
    console.log(response);

    const dataFile = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    return res.status(200).json({
      success: true,
      message: "video uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error in video upload",
    });
  }
};

// image size reducer

exports.imageResizeUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const files = req.files.imageFile;
    console.log(files);

    const supportedTypes = ["jpg", "jpeg", "png", "pdf"];
    const fileType = files.name.split(".")[1].toLowerCase();

    // validation

    if (!isfileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported Please Upload supported file type",
      });
    }

    // file type supported

    const response = await UploadFileToCloudinary(files, "MyData", 10);
    console.log(response);

    // db mai entry create karni hai
    const fileData = await File.create({
      name,
      email,
      tags,
      imageUrl: response.secure_url,
    });

    return res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Data Uplaoded SuccessFully on cloudinary",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error during image uploading",
    });
  }
};
