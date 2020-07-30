const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.get("/dcpu/dashboard", async (req, res) => {
  res.render("dcpu/dcpu-dashboard-home.ejs");
});

module.exports = router;
