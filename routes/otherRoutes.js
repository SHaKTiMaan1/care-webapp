const router = require("express").Router();
const bcrypt = require("bcryptjs");

router.get('/state/:official_id', function(req,res){
  res.render("state/state-dashboard-home.ejs");
});



module.exports = router;