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
    const cci_list = await Cci.find(
      { cwc_id: employee.cwc_id },
      { _id: 0, cci_name: 1, cci_id: 1 }
    );
    const allCci = await Cci.find({ district: cwc.district });

    res.render("CWC/cwcdashboard-childRegistration.ejs", {
      employee: employee,
      allCci: allCci,
      district: cwc.district,
      cci_list: cci_list,
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
    let prefix = req.body.firstName.substring(0, 3);
    let mid1 = cwcemployee.cwc_id.substring(0, 3);
    let mid2 = dateOfBirth.substring(0, 3);
    var end = 0000;

    childID = prefix.concat(mid1, mid2, end);
    var existingChild = null;
    do {
      end = Math.floor(Math.random() * 8999) + 1000;
      childID = prefix.concat(mid1, mid2, end);
      existingChild = await Child.findOne({ child_id: childID });
    } while (existingChild);

    console.log(req.body.cci_id);

    const cci = await Cci.findOne({cci_id:req.body.cci_id})

    const child = new Child({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      age: req.body.age,
      gender: req.body.gender,
      casteCategory: req.body.caste,
      aadharNumber: req.body.aadharNumber,
      fatherName: req.body.fatherName,
      motherNAme: req.body.motherName,
      registrationDate: currentDate,
      child_id: childID,
      cci_id: String(req.body.cci_id),
      cci_name: cci.cci_name,
      cwc_id: cwcemployee.cwc_id,
      religion: req.body.religion,
      witness_id: cwcemployee.employee_id,
      guardian_id: [],
      height: [
        {
          date: currentDate,
          value: req.body.height,
        },
      ],
      weight: [
        {
          date: currentDate,
          value: req.body.weight,
        },
      ],
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
  const cwc_id = employee.cwc_id;
  const cwc = await Cwc.findOne({ cwc_id: cwc_id });
  // console.log(cwc);
  const cwcEmployee_count = await CwcEmployee.countDocuments({
    cwc_id: cwc_id,
  });
  const cci_list = await Cci.find(
    { cwc_id: cwc_id },
    { _id: 0, cci_name: 1, cci_id: 1 }
  );
  const cci_count = await Cci.countDocuments({ cwc_id: cwc_id });
  // console.log(cci);
  // console.log("Employee found in CWC Route :");
  // console.log(employee);
  res.render("CWC/dashboardHome.ejs", {
    employee: employee,
    cci_list: cci_list,
    cwc: cwc,
    cci_count: cci_count,
    cwcEmployee_count: cwcEmployee_count,
  });
});

//CHILDREN LIST PAGE
router.get("/cwc/dashboard/allChildren/:employee_id", async function (
  req,
  res
) {
  const idToSearch = req.params.employee_id;
  const employee = await CwcEmployee.findOne({ employee_id: idToSearch });
  const cci_list = await Cci.find(
    { cwc_id: employee.cwc_id },
    { _id: 0, cci_name: 1, cci_id: 1 }
  );
  const child = await Child.find({cwc_id:employee.cwc_id})
  console.log(child)
  res.render("CWC/allChildrenInCwc.ejs", {
    employee: employee,
    cci_list: cci_list,
    child : child
  });
});

//CCI INFORMATION
router.get("/cwc/dashboard/cciDetails/:employee_id", async (req, res) => {
  const employee = await CwcEmployee.findOne({
    employee_id: req.params.employee_id,
  });

  const cci_list = await Cci.find(
    { cwc_id: employee.cwc_id },
    { _id: 0, cci_name: 1, cci_id: 1 }
  );
  const cwc = await Cwc.findOne({ cwc_id: employee.cwc_id });

  console.log(cwc);
  allCci = await Cci.find({ district: cwc.district });

  try {
    res.render("CWC/showCciInformation.ejs", {
      allCci: allCci,
      district: cwc.district,
      employee: employee,
      cci_list: cci_list,
    });
  } catch (err) {
    console.log("There is an error : ");
    console.log(err);
  }
});

module.exports = router;
