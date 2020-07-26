const router = require("express").Router();
const bcrypt = require("bcryptjs");
const CciEmployee = require("../models/cciEmployee");
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Admin = require("../models/admin");
const { registerValidationEmployee } = require("../validation");
const { Router } = require("express");

//NEW ADMIN REGISTRATION ROUTES
router.get("/admin/registerNewAdmin/:employee_id", async (req, res) => {
  const idToSearch = req.params.employee_id.substring(1);
  const admin = await Admin.findOne({ employee_id: idToSearch });

  res.render("registration/registerNewAdmin.ejs", { admin: admin });
});

router.post("/admin/registerNewAdmin/:employee_id", async (req, res) => {
  const registeredBy = req.params.employee_id.substring(1);

  //CHECKING IF USER ALREADY EXISTS
  const emailExists = await Admin.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email Already Exists");
  console.log("Email Doesn't alreasy exist");

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log("Password hashed " + hashedPassword);

  //CREATING A NEW ADMIN
  const admin = new Admin({
    employee_id: req.body.employee_id,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    contactNumber: req.body.contactNumber,
    aadharNumber: req.body.aadharNumber,
    email: req.body.email,
    password: hashedPassword,
    autherisation_level: req.body.autherisation_level,
    registeredBy: registeredBy,
  });

  console.log("Admin Created " + admin);

  try {
    const savedAdmin = await admin.save();

    console.log("Admin saved " + savedAdmin);

    res.send("Registered");
  } catch (err) {
    console.log("We got some error");
    res.send("There was error" + err);
  }
});

//CWC REGISTRATION ROUTES
router.get("/admin/registerNewCwc/:employee_id", async (req, res) => {
  const idToSearch = req.params.employee_id.substring(1);
  const admin = await Admin.findOne({ employee_id: idToSearch });

  console.log("Admin Found : " + admin);
  res.render("registration/registerNewCwc.ejs", { admin: admin });
});

router.post("/admin/registerNewCwc/:employee_id", async (req, res) => {
  const registeredBy = req.params.employee_id.substring(1);
  const currentDate = new Date();
  console.log("currentDate");
  //CHECKING IF CWC ALREADY EXISTS
  const cwcExists = await Admin.findOne({ cwc_id: req.body.cwc_id });
  if (cwcExists) return res.status(400).send("CWC ID Already Exists");
  console.log("CWC ID Doesn't alreasy exist");

  const cwc = new Cwc({
    cwc_id: req.body.cwc_id,
    address: req.body.address,
    district: req.body.district,
    state: req.body.state,
    pincode: req.body.pincode,
    email: req.body.email,
    registeredBy: registeredBy,
    dateOfRegistration: currentDate,
    count: 0,
  });

  console.log("CWC Created " + cwc);

  try {
    const savedCwc = await cwc.save();

    console.log("Cwc saved " + savedCwc);

    res.send("Registered");
  } catch (err) {
    console.log("We got some error");
    res.send("There was error" + err);
  }
});

//CWC EMPLOYEE REGISTRATION ROUTES
router.get("/admin/registerNewCwcEmployee/:employee_id", async (req, res) => {
  const idToSearch = req.params.employee_id.substring(1);

  const admin = await Admin.findOne({ employee_id: idToSearch });

  res.render("registration/registerNewCwcEmployee.ejs", { admin: admin });
});

router.post("/admin/registerNewCwcemployee/:employee_id", async (req, res) => {
  //VALIDATING DATA BEFORE MAKING USER
  // const { error } = registerValidationEmployee(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  console.log("Validated");

  //CHECKING IF USER ALREADY EXISTS
  const emailExists = await CwcEmployee.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email Already Exists");

  console.log("Email doesn't already exist");

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  console.log("Password hashed " + hashedPassword);

  //CREATING A NEW CWC EMPLOYEE
  const employee = new CwcEmployee({
    employee_id: req.body.employee_id,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    aadharNumber: req.body.aadharNumber,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    cwc_id: req.body.cwc_id,
    password: hashedPassword,
  });

  console.log("Employee Created " + employee);

  try {
    const savedEmployee = await employee.save();

    console.log("Employee saved " + savedEmployee);

    res.send("Registered");
  } catch (err) {
    console.log("We got some error");
    res.send("There was error" + err);
  }
});

//CCI REGISTRATION
router.get(
  "/cwc/dashboard/newCciRegistraton/:employee_id",
  async (req, res) => {
    const employee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });

    console.log("CWC Employee Found : " + employee);
    res.render("registration/registerNewCci.ejs", { employee: employee });
  }
);

//====================================================================================

router.get("/registerByCWC/cciEmployee", (req, res) => {
  res.render("employeeRegistration.ejs", {
    category: "cciEmployee",
    registrationBy: "registerByCWC",
  });
});

router.post("/registerByCWC/cciemployee", async (req, res) => {
  //VALIDATING DATA BEFORE MAKING USER
  const { error } = registerValidationEmployee(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Validated");
  //CHECKING IF USER ALREADY EXISTS
  const emailExists = await CciEmployee.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email Already Exists");

  console.log("Email doesn't already exist");

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  console.log("Password hashed " + hashedPassword);

  //CREATING A NEW CCI EMPLOYEE
  const employee = new CciEmployee({
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    employee_id: req.body.employee_id,
    cci_id: req.body.cci_id,
    password: hashedPassword,
  });

  console.log("Employee Created " + employee);

  try {
    const savedEmployee = await employee.save();

    console.log("Employee saved " + savedEmployee);

    res.send("Registered");
  } catch (err) {
    console.log("We got some error");
    res.send("There was error" + err);
  }
});

module.exports = router;
