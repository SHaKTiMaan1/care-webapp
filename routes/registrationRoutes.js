const router = require("express").Router();
const bcrypt = require("bcryptjs");
const CciEmployee = require("../models/cciEmployee");
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Admin = require("../models/admin");
const StateOfficial = require("../models/stateOfficial");
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
    stregth: 0,
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
  const admin = await Admin.findOne({ employee_id: req.params.employee_id });

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

  console.log("Email doesn't already exist"); //kcsvjkjvklsdj

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log("Password hashed " + hashedPassword);

  //GETTING DETAILS OF THE CWC
  const cwc = await Cwc.findOne({ cwc_id: req.body.cwc_id });

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
    district: cwc.cwc_id,
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

//CCI REGISTRATION ROUTE
router.get(
  "/cwc/dashboard/newCciRegistraton/:employee_id",
  async (req, res) => {
    const employee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });
    const cci_list = await Cci.find(
      { cwc_id: employee.cwc_id },
      { _id: 0, cci_name: 1, cci_id: 1 }
    );
    console.log("CWC Employee Found : " + employee);
    res.render("registration/registerNewCci.ejs", {
      employee: employee,
      cci_list: cci_list,
    });
  }
);

router.post(
  "/cwc/dashboard/newCciRegistraton/:employee_id",
  async (req, res) => {
    //LOOKING FOR THE EMPLOYEE WHO'S REGISTERING
    const cwcemployee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });
    console.log("CWC Employee Found : " + cwcemployee);

    //LOOKING FOR PARENT CWC
    const cwc = await Cwc.findOne({
      cwc_id: cwcemployee.cwc_id,
    });
    console.log("CWC  Found : " + cwc);

    let distName = cwc.district;
    distName = distName.substring(0, 3);
    count = cwc.count;

    let prefix = "00";
    count++;

    if (count > 9) {
      prefix = "0";
    }

    const ID = distName.concat(prefix, count); // concatinating for makin CCIID
    console.log(ID);

    // CREATING THE DOCUMENT IN DATABASE
    const cci = new Cci({
      cci_id: ID,
      cci_name: req.body.name,
      strength: 0,
      cci_HeadName: {
        fname: req.body.fname,
        lname: req.body.lname,
      },
      address: req.body.address,
      district: cwc.district,
      state: cwc.state,
      pincode: req.body.pincode,
      contactNumber: req.body.contact_no,
      email: req.body.email,
      cwc_id: cwc.cwc_id,
      registeredBy: cwcemployee.employee_id,
    });

    try {
      savedCci = cci.save();
      updatedCwc = await Cwc.updateOne(
        { cwc_id: cwc.cwc_id },
        { $inc: { count: 1 } }
      );
      res.redirect("/cwc/dashboard/" + cwcemployee.employee_id);
    } catch (e) {
      console.log("Error in cci creating route ");
    }
  }
);

//====================================================================================

//CCI EMPLOYEE REGISTRATION ROUTES
router.get(
  "/cwc/dashboard/newCciEmployeeRegistraton/:employee_id/:cci_id",
  async (req, res) => {
    const employee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });
    const cci_list = await Cci.find(
      { cwc_id: employee.cwc_id },
      { _id: 0, cci_name: 1, cci_id: 1 }
    );

    res.render("registration/registerNewCciEmployee.ejs", {
      employee: employee,
      cci_list: cci_list,
      cci_id: req.params.cci_id,
    });
  }
);

router.post(
  "/cwc/dashboard/newCciEmployeeRegistraton/:employee_id/:cci_id",
  async (req, res) => {
    //CHECKING IF USER ALREADY EXISTS
    const emailExists = await CciEmployee.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send("Email Already Exists");

    console.log("Email doesn't already exist");

    //HASHING THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    console.log("Password hashed " + hashedPassword);

    const cwcemployee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });

    //CREATING A NEW CCI EMPLOYEE
    const employee = new CciEmployee({
      name: req.body.fname,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      gender: req.body.gender,
      cwc_id: cwcemployee.cwc_id,
      cci_id: req.params.cci_id,
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
  }
);

// ================================================================================
// REGISTER NEW STATE OFFICIAL

router.get("/admin/registerStateOfficial/:employee_id", async function (
  req,
  res
) {
  const idToSearch = req.params.employee_id;
  const admin = await Admin.findOne({ employee_id: idToSearch });
  res.render("registration/registerNewStateOfficial.ejs", { admin: admin });
});

router.post("/admin/registerStateOfficial/:admin_employee_id", async function (
  req,
  res
) {
  // Creating ID
  var statename = req.body.state;
  statename = statename.substring(0, 3);
  var fname = req.body.firstName;
  fname = fname.substring(0, 3);
  official_id = "";
  randomNo = "";
  randomNo = (Math.floor(Math.random() * (999 - 100)) + 100).toString();

  official_id = statename.concat(fname, randomNo);

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log("Password hashed " + hashedPassword);

  //CREATING A NEW CCI EMPLOYEE
  const official = new StateOfficial({
    employee_id: official_id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    state: req.body.state,
    gender: req.body.gender,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    aadharNumber: req.body.aadharNumber,
    password: hashedPassword,
    registeredBy: req.params.admin_employee_id,
  });

  console.log("Official Created " + official);

  try {
    const savedOfficial = await official.save();

    console.log("Employee saved " + savedOfficial);

    res.send("Registered");
  } catch (err) {
    console.log("We got some error");
    res.send("There was error" + err);
  }
});

module.exports = router;
