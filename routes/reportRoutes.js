const router = require("express").Router();

const report = require('../models/report.js')


router.post("/report",async function(req, res){
  console.log(req.body.district)
  report.create({
    district : req.body.district,
    date : new Date(),
  SenderDetails: [
    {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      address:req.body.address,
      gender:req.body.gender
    }
  ],
  subject:req.body.subject,
  description:req.body.description

  }), function(err, done){
    if(err){
      console.log(err);
    }
    else{
      console.log(done);
      res.redirect("/");
    }
  }
  
})


module.exports = router

