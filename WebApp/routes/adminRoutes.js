const router = require("express").Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

router.get("/admin/dashboard/:employee_id", async (req, res) => {
  const idToSearch = req.params.employee_id;

  const admin = await Admin.findOne({ employee_id: idToSearch });
  console.log("I found you : " + admin);
  res.render("admin/adminDashboardHome.ejs", { admin: admin });
});

module.exports = router;
