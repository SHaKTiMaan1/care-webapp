const router = require("express").Router();
const CciEmployee =   require("../models/cciEmployee");

router.get('/cci/dashboard/:employee_id', async function(req, res){
  const employee = await CciEmployee.findOne({
    employee_id: req.params.employee_id,
  });
  res.render("CCI/cciDashboardHome.ejs", {employee: employee});
});

module.exports = router;