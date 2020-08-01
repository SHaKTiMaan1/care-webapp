const router = require("express").Router();

const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");


router.get('/getChildInfo/:cci_id/:employeeEmail/:hashedPassword', async(req, res) =>{
  const cci_employee = await CciEmployee.findOne({})
})


module.exports = router