const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

//POST ROUTE FOR CHILD REGISTRATION
router.post(
  "/cwc/dashboard/childRegistration/:employee_id",
  async (req, res) => {
    const cwcemployee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });

    let dateOfBirth = String(req.body.dateOfBirth);
    let currentDate = new Date();
    let prefix = firstName.substring(0, 3);
    let mid1 = cwcemployee.cwc_id.substring(0, 3);
    let mid2 = dateOfBirth.substring(0, 3);
    var end = 0000;

    childID = prefix.concat(mid1, mid2, end);

    do {
      end = Math.floor(Math.random() * 8999) + 1000;
      childID = prefix.concat(mid1, mid2, end);
      const existingChild = await Child.findOne({ child_id: childID });
    } while (existingChild);

    const child = new Child({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      casteCategory: req.body.casteCategory,
      aadharNumber: req.body.aadharNumber,
      registrationDate: currentDate,
      child_id: childID,
      cci_id: req.body.cci_id,
      cwc_id: cwcemployee.cwc_id,
      religion: req.body.religion,
      witness_id: cwcemployee.employee_id,
      guardian_id: [],
    });

    child.height.push({
      date: currentDate,
      value: req.body.height,
    });

    child.weight.push({
      date: currentDate,
      value: req.body.weight,
    });

    try {
      savedChild = child.save();
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
