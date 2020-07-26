const router = require("express").Router();
const bcrypt = require("bcryptjs");
const CciEmployee = require("../models/cciEmployee");
const CwcEmployee = require("../models/cwcEmployee");
const Admin = require("../models/admin");
const { loginValidation } = require("../validation");

//ADMIN LOGIN
router.get("/login/admin", (req, res) => {
  res.render("login/loginAdmin.ejs");
});

router.post("/login/admin", async (req, res) => {
  //VALIDATING THE INPUTS
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Validated Admin login");

  //CHECKING IF USER EXISTS
  console.log(req.body.email);
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) res.send("admin doesn't exist");

  console.log("Found admin " + admin);

  //CHECKING IF PASSWORD IS CORRECT
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    admin.password
  );

  console.log("isPasswordValid : " + isPasswordValid);
  if (isPasswordValid) {
    res.redirect("/admin/dashboard/" + admin.employee_id);
  } else {
    res.send("Wrong Password !!");
  }
});

//CWC EMPLOYEE LOGIN
router.get("/login/cwcemployee", (req, res) => {
  res.render("login/loginCwcEmployee.ejs");
});

router.post("/login/cwcemployee", async (req, res) => {
  //VALIDATING THE INPUTS
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Validated login");

  //CHECKING IF USER EXISTS
  const employee = await CwcEmployee.findOne({ email: req.body.email });
  if (!employee) res.send("Employee doesn't exist");

  console.log("Found Employee " + employee);

  //CHECKING IF PASSWORD IS CORRECT
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    employee.password
  );

  console.log("isPasswordValid : " + isPasswordValid);
  if (isPasswordValid) {
    res.redirect("/cwc/dashboard/" + employee.employee_id);
  } else {
    res.send("Wrong Password !!");
  }
});

//CCI EMPLOYEE LOGIN
router.post("/login/cciemployee", async (req, res) => {
  //VALIDATING THE INPUTS
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Validated login");

  //CHECKING IF USER ALREADY EXISTS
  const employee = await CciEmployee.findOne({ email: req.body.email });
  if (!employee) res.send("Employee doesn't exist");

  console.log("Found Employee " + employee);
  //CHECKING IF PASSWORD IS CORRECT
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    employee.password
  );

  console.log("isPasswordValid : " + isPasswordValid);
  if (isPasswordValid) {
    res.send("Logged In");
  } else {
    res.send("Wrong Password !!");
  }
});

//OTHERS lOGIN
router.post("/login/liason", (req, res) => {});

module.exports = router;
