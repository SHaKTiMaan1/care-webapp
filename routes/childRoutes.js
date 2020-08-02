const router = require("express").Router();
const CwcEmployee = require("../models/cwcEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");
const Admin = require("../models/admin");

//POST ROUTE FOR CHILD REGISTRATION
router.post(
  "/cwc/dashboard/childRegistration/:employee_id",
  async (req, res) => {
    const cwcemployee = await CwcEmployee.findOne({
      employee_id: req.params.employee_id,
    });

    console.log(cwcemployee);

    const superadmin = await Admin.findOne({
      autherisation_level: "superadmin",
    });

    console.log(superadmin);

    let dateOfBirth = new Date(req.body.dateOfBirth);
    let currentDate = new Date();
    let prefix = req.body.firstName.substring(0, 3).toUpperCase();
    let mid1 = cwcemployee.cwc_id.substring(0, 3).toUpperCase();
    let mid2 = "0000";
    var end = 00000;

    var age = req.body.age;
    if (dateOfBirth) {
      console.log(req.body.dateOfBirth.substring(0, 4));
      mid2 = req.body.dateOfBirth.substring(0, 4);
      age = Math.floor(
        (currentDate.getTime() - dateOfBirth.getTime()) /
          (1000 * 3600 * 24 * 365.25)
      );
    }

    childID = prefix.concat(mid1, mid2, end);

    var existingChild = null;
    do {
      end = Math.floor(Math.random() * 89999) + 10000;
      childID = prefix.concat(mid1, mid2, end);
      existingChild = await Child.findOne({ child_id: childID });
    } while (existingChild);

    const cci = await Cci.findOne({ cci_id: req.body.cci_id });
    const cwc = await Cwc.findOne({ cwc_id: cci.cwc_id });

    //ELIGIBILITY LOGIC
    var nextStatusEvaluationDate = new Date();
    var numberOfDaysToAdd = 50;
    if (age < 2) {
      numberOfDaysToAdd =
        superadmin.eligibilityListCriteria.ageLessThan2
          .timeIntervalForEvaluation;
    } else {
      numberOfDaysToAdd =
        superadmin.eligibilityListCriteria.ageMoreThan2
          .timeIntervalForEvaluation;
    }
    // 1000 * 3600 * 24 * 365.25;

    nextStatusEvaluationDate.setDate(
      nextStatusEvaluationDate.getDate() + numberOfDaysToAdd
    );
    console.log(currentDate);
    console.log(nextStatusEvaluationDate);

    //CHILD DATA
    const child = new Child({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      age: age,
      gender: req.body.gender,
      casteCategory: req.body.caste,
      aadharNumber: req.body.aadharNumber,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      registrationDate: currentDate,
      child_id: childID,
      cci_id: String(req.body.cci_id),
      cci_name: cci.cci_name,
      cwc_id: cwcemployee.cwc_id,
      religion: req.body.religion,
      witness_id: cwcemployee.employee_id,
      witness_name:
        cwcemployee.firstName +
        " " +
        cwcemployee.middleName +
        " " +
        cwcemployee.lastName,
      guardian_id: [],
      height: [
        {
          date: currentDate,
          value: req.body.height,
        },
      ],
      weight: [
        {
          date: currentDate,
          value: req.body.weight,
        },
      ],
    });

    try {
      savedChild = child.save();
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
