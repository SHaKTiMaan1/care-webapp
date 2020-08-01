const router = require("express").Router();
const bcrypt = require("bcryptjs");

const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.get("/firstTimeLogin/:employeeEmail/:Password", async (req, res) => {
  const cci_employee = await CciEmployee.findOne({
    email: req.params.employeeEmail,
  });
  console.log(hashedPassword);
  //checking if Password is valid
  const isPasswordValid = await bcrypt.compare(
    req.params.Password,
    cci_employee.password
  );

  const child = await Child.find({ cci_id: cci_employee.cci_id });
  if (isPasswordValid) {
    res.send(child);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
