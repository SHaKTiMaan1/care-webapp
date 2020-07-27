const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

//FOR GETTING THE FORM TO REGISTER A NEW CHILD
router.get(
  "/cwc/dashboard/childRegistration/:employee_id",
  async (req, res) => {
    const idToSearch = req.params.employee_id;
    const employee = await CwcEmployee.findOne({ employee_id: idToSearch });
    const cwc = await Cwc.findOne({ cwc_id: employee.cwc_id });

    const allCci = await Cci.find({ district: cwc.district });

    res.render("CWC/cwcdashboard-childRegistration.ejs", {
      employee: employee,
      allCci: allCci,
      district: cwc.district,
    });
  }
);

//POST ROUTE FOR CHILD REGISTRATION
router.post(
  "/cwc/dashboard/childRegistration/:employee_id",
  async (req, res) => {
    const cwcemployee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });

    let dateOfBirth = String(req.body.dateOfBirth);
    let currentDate = new Date();
    let prefix = firstName.substring(0, 3);
    let mid1 = cwcemployee.cwc_id.substring(0, 3);
    let mid2 = dateOfBirth.substring(0, 3);
    var end = 0000;

    childID = prefix.concat(mid1, mid2, end);

    do {
      end = Math.floor(Math.random() * 8999) + 1000;
      childID = prefix.concat(mid1, mid2, end);
      const existingChild = await Child.findOne({ child_id: childID });
    } while (existingChild);

    const child = new Child({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      casteCategory: req.body.casteCategory,
      aadharNumber: req.body.aadharNumber,
      registrationDate: currentDate,
      child_id: childID,
      cci_id: req.body.cci_id,
      cwc_id: cwcemployee.cwc_id,
      religion: req.body.religion,
      witness_id: cwcemployee.employee_id,
      guardian_id: [],
    });

    child.height.push({
      date: currentDate,
      value: req.body.height,
    });

    child.weight.push({
      date: currentDate,
      value: req.body.weight,
    });

    try {
      savedChild = child.save();
    } catch (err) {
      console.log(err);
    }
  }
);

//CWC DASHBOARD
router.get("/cwc/dashboard/:employee_id", async function (req, res) {
  const idToSearch = req.params.employee_id;

  const employee = await CwcEmployee.findOne({ employee_id: idToSearch });
  console.log("Employee found in CWC Route :");
  console.log(employee);
  res.render("CWC/dashboardHome.ejs", { employee: employee });
});

//CCI INFORMATION
router.get("/cwc/dashboard/cciDetails/:employee_id", async (req, res) => {
  const employee = await CwcEmployee.findOne({
    employee_id: req.params.employee_id,
  });
  const cwc = await Cwc.findOne({ cwc_id: employee.cwc_id });

  allCci = await Cci.find({ district: cwc.district });

  try {
    res.render("CWC/showCciInformation.ejs", {
      allCci: allCci,
      district: cwc.district,
      employee: employee,
    });
  } catch (err) {
    console.log("There is an error : ");
    console.log(err);
  }
});

module.exports = router;
