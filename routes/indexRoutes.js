const { route } = require("./cwcRoutes");
const router = require("express").Router();
const multer = require("multer");
const helpers = require("../helpers");
const path = require("path");
const Child = require("../models/child");
const { v4: uuidv4 } = require("uuid");

//SETTING UP STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  // By default, multer removes file extensions so ADDING THEM BACK
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/loginOptions", (req, res) => {
  res.render("login/loginOptions.ejs");
});

router.get("/report", function (req, res) {
  res.render("Tanisha/report-portal.ejs");
});

router.get("/popup", (req, res) => {
  res.render("Tanisha/creating-popup.ejs");
});

router.get("/fileUpload", (req, res) => {
  res.render("test/fileUpload.ejs");
});

router.post("/fileUpload", (req, res) => {
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).single("profile_pic");
  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    console.log(req.body);
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    res.send(
      `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
    );
  });
});

router.get("/testDate", async (req, res) => {
  var childID = uuidv4();
  childID = childID.toUpperCase();

  console.log(childID);
  res.send(childID);
});

module.exports = router;
