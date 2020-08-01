const router = require("express").Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

router.get(
  "/admin/dashboard/eligibilityCritegia/:employee_id",
  async (req, res) => {
    const admin = await Admin.findOne({ employee_id: req.params.employee_id });
    res.render("admin/eligibility-list-addition-criteria.ejs", {
      admin: admin,
    });
  }
);

router.get("/admin/dashboard/:employee_id", async (req, res) => {
  const admin = await Admin.findOne({ employee_id: req.params.employee_id });
  res.render("admin/adminDashboardHome.ejs", { admin: admin });
});

module.exports = router;
