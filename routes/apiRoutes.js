const router = require("express").Router();
const bcrypt = require("bcryptjs");

const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");


router.get('/firstTimeLogin/:cci_id/:employeeEmail/:Password', async(req, res) =>{
  const cci_employee = await CciEmployee.findOne({email: req.params.employeeEmail});

  //checking if Password is valid
  const isPasswordValid = await bcrypt.compare(
    req.params.Password,
    cci_employee.password
  );

  const child = await Child.find({cci_id:req.params.cci_id});
  res.send(child);

})


module.exports = router