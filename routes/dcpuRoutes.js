const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");
const report = require("../models/report");
const dcpuOfficer = require("../models/dcpuOfficer");

router.get("/dcpu/dashboard/:employee_id", async (req, res) => {

  const employee = await dcpuOfficer.findOne({employee_id : req.params.employee_id})
  // console.log(employee)
  
  const Report = await report.find({district:employee.district})
  const cwc = await Cwc.findOne({district:employee.district})
  idToSearch = cwc.cwc_id
  const child_count = await Child.countDocuments({cwc_id:cwc.cwc_id})
  console.log(Report)
  res.render("dcpu/dcpu-dashboard-home.ejs", {employee: employee, report: Report, child_count:child_count})
});

module.exports = router;
