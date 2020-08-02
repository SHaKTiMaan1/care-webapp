const router = require("express").Router();
const bcrypt = require("bcryptjs");

const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.get(
  "/firstTimeLogin/:employeeEmail/:hashedPassword",
  async (req, res) => {
    const cci_employee = await CciEmployee.findOne({
      email: req.params.employeeEmail,
    });
    console.log(cci_employee);
    passwordToCompare = myStr.replace(/%2F/g, "/");

    //checking if Password is valid
    const isPasswordValid = await bcrypt.compare(
      req.params.passwordToCompare,
      cci_employee.password
    );

    if (isPasswordValid) {
      const child = await Child.find({ cci_id: cci_employee.cci_id });
      res.send(child);
    } else {
      res.send("401 Error");
    }
  }
);

router.get(
  "/firstTimeLoginPlain/:employeeEmail/:Password",
  async (req, res) => {
    const cci_employee = await CciEmployee.findOne({
      email: req.params.employeeEmail,
    });
    console.log(req.params.Password);

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
  }
);

module.exports = router;
