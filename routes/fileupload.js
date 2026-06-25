const express = require("express");
const router = express.Router();

const { localFileUpload  , imageUpload , videoUpload , imageResizeUpload} = require("../controllers/FileUpload");

router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);
router.post("/imageResizeUpload", imageResizeUpload);

module.exports = router;