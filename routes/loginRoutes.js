const router = require("express").Router();
const bcrypt = require("bcryptjs");
const CciEmployee = require("../models/cciEmployee");
const CwcEmployee = require("../models/cwcEmployee");
const DcpuOfficer = require("../models/dcpuOfficer");
const StateOfficial = require("../models/stateOfficial");
const NationalOfficial = require("../models/nationalOfficial");
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

router.post("/loginOptions", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Validated login");

  const cwcEmployee = await CwcEmployee.findOne({ email: req.body.email });
  if (cwcEmployee) {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      cwcEmployee.password
    );

    console.log("isPasswordValid : " + isPasswordValid);
    if (isPasswordValid) {
      redirectionLink = "/cwc/dashboard/";
      userid = cwcEmployee.employee_id;
    } else {
      res.send("Wrong Password !!");
    }
  }
  if (!cwcEmployee) {
    console.log("Not CWC EMployee");
    const cciEmployee = await CciEmployee.findOne({ email: req.body.email });
    if (cciEmployee) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        cciEmployee.password
      );
      console.log("isPasswordValid : " + isPasswordValid);
      if (isPasswordValid) {
        redirectionLink = "/cci/dashboard/";
        console.log(redirectionLink);
        userid = cciEmployee.employee_id;
      } else {
        res.send("Wrong Password !!");
      }
    }
    if (!cciEmployee) {
      console.log("Not CCI EMployee");
      const dcpuOfficer = await DcpuOfficer.findOne({
        email: req.body.email,
      });
      console.log(dcpuOfficer);
      if (dcpuOfficer) {
        const isPasswordValid = await bcrypt.compare(
          req.body.password,
          dcpuOfficer.password
        );
        console.log("isPasswordValid : " + isPasswordValid);
        if (isPasswordValid) {
          redirectionLink = "/dcpu/dashboard/";
          userid = dcpuOfficer.employee_id;
        } else {
          res.send("Wrong Password !!");
        }
      }
      if (!dcpuOfficer) {
        console.log("Not DCPU Officer");
        const stateOfficial = await StateOfficial.findOne({
          email: req.body.email,
        });
        console.log(stateOfficial);
        if (stateOfficial) {
          const isPasswordValid = await bcrypt.compare(
            req.body.password,
            stateOfficial.password
          );
          console.log("isPasswordValid : " + isPasswordValid);
          if (isPasswordValid) {
            redirectionLink = "/state/dashboard/";
            userid = stateOfficial.employee_id;
            console.log(redirectionLink);
          } else {
            res.send("Wrong Password !!");
          }
        }
        if (!stateOfficial) {
          console.log("Not State Official");
          const nationalOfficial = await NationalOfficial.findOne({
            email: req.body.email,
          });
          if (nationalOfficial) {
            const isPasswordValid = await bcrypt.compare(
              req.body.password,
              nationalOfficial.password
            );
            console.log("isPasswordValid : " + isPasswordValid);
            if (isPasswordValid) {
              redirectionLink = "/nation/dashboard/";
              userid = nationalOfficial.employee_id;
            } else {
              res.send("Wrong Password !!");
            }
          }
        }
      }
    }
  }
  res.redirect(redirectionLink + userid);
  console.log(redirectionLink + userid);
});

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

// STATE LOGIN
router.get("/login/state", async function (req, res) {
  res.render("login/loginstate.ejs");
});

router.post("/login/state", async (req, res) => {
  //CHECKING IF USER EXISTS
  console.log(req.body.email);
  const stateOfficial = await StateOfficial.findOne({ email: req.body.email });
  if (!stateOfficial) res.send("Official doesn't exist");

  console.log("Found Official " + stateOfficial);

  //CHECKING IF PASSWORD IS CORRECT
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    stateOfficial.password
  );

  console.log("isPasswordValid : " + isPasswordValid);
  if (isPasswordValid) {
    res.redirect("/state/" + stateOfficial.official_id);
  } else {
    res.send("Wrong Password !!");
  }
});

//OTHERS lOGIN
router.post("/login/liason", (req, res) => {});

module.exports = router;
