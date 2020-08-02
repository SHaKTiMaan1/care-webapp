const router = require("express").Router();
const StateOfficial = require("../models/stateOfficial");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");

router.get("/state/dashboard/:employee_id", async function (req, res) {
  const stateOfficial = await StateOfficial.findOne({
    employee_id: req.params.employee_id,
  });
  const cwc_count = await Cwc.countDocuments({ state: stateOfficial.state });
  const cci_count = await Cci.countDocuments({ state: stateOfficial.state });

  res.render("state/state-dashboard-home.ejs", {
    StateOfficial: stateOfficial,
    cwc_count: cwc_count,
    cci_count: cci_count,
  });
});

module.exports = router;
