const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

//FOR GETTING THE FORM TO REGISTER A NEW CHILD
router.get("/cwc/dashboard/childRegistration/:employee_id", async function (
  req,
  res
) {
  const idToSearch = req.params.employee_id;
  const employee = await CwcEmployee.findOne({ employee_id: idToSearch });
  res.render("CWC/cwcdashboard-childRegistration.ejs", { employee: employee });
});

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
    Child.find({}, function (err, child) {
      if (err) {
        console.log(error);
      } else {
        res.render("CWC/showCciInformation.ejs", {
          allCci: allCci,
          allChildren: child,
          district: cwc.district,
          employee: employee,
        });
      }
    });
  } catch (err) {
    console.log("There is an error : ");
    console.log(err);
  }
});

module.exports = router;
