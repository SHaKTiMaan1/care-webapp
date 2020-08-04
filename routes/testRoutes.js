const { route } = require("./cwcRoutes");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const Child = require("../models/child");

const Cryptr = require("cryptr");
var secret = String(JSON.stringify(process.env.AADHAR_KEY));
cryptr = new Cryptr(secret);

router.get("/testing", async (req, res) => {
  var aadharNum = 9887654321656565;
  console.log(aadharNum);
  aadharNum = JSON.stringify(aadharNum);
  encryptedAadharNum = cryptr.encrypt(aadharNum);
  console.log(encryptedAadharNum);
  aadharNum = cryptr.decrypt(encryptedAadharNum);
  console.log(aadharNum);
  res.send("done " + typeof process.env.AADHAR_KEY);
});

module.exports = router;
