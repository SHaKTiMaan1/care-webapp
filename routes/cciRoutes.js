const router = require("express").Router();


router.get('/cci/dashboard/:employee_id', function(req, res){
  res.render("CCI/cciDashboardHome.ejs");
})

module.exports = router;