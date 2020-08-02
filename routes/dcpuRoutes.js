const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");
const dcpuOfficer = require("../models/dcpuOfficer");

router.get("/dcpu/dashboard/:employee_id", async (req, res) => {

  const employee = await dcpuOfficer.findOne({employee_id : req.params.employee_id})
  console.log(employee)
  res.render("dcpu/dcpu-dashboard-home.ejs", {employee: employee});
});

module.exports = router;
