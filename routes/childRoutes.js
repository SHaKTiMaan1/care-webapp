const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const Cryptr = require("cryptr");

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
    const superadmin = await Admin.findOne({
      autherisation_level: "superadmin",
    });

    //ENCRYPTING THE AADHAR NUMBER
    const secret = String(JSON.stringify(process.env.AADHAR_KEY));
    const cryptr = new Cryptr(secret);
    var encryptedAadharNum = "";

    if (req.body.aadharNumber) {
      var encryptedAadharNum = cryptr.encrypt(req.body.aadharNumber);
    }

    //GENERATING CHILD ID
    var childID = uuidv4();
    childID = childID.toUpperCase();

    let dateOfBirth = new Date(req.body.dateOfBirth);
    let currentDate = new Date();
    // let dummyDate = new Date("2020-01-22");

    //Calculating Age
    var age = req.body.age;
    if (dateOfBirth) {
      age = Math.floor(
        (currentDate.getTime() - dateOfBirth.getTime()) /
          (1000 * 3600 * 24 * 365.25)
      );
    }

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
      caste: req.body.caste,
      aadharNumber: encryptedAadharNum,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      registrationDate: currentDate,
      nextStatusEvaluationDate: nextStatusEvaluationDate,
      child_id: childID,
      cci_id: String(req.body.cci_id),
      cci_name: cci.cci_name,
      cwc_id: cwcemployee.cwc_id,
      religion: req.body.religion,
      isDataComplete: false,
      isUpForAdoption: false,
      hasCSR: false,
      hasMER: false,
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
