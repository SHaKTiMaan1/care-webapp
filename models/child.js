var mongoose = require("mongoose");

var childSchema = new mongoose.Schema({
  firstName: {
    type: String, //Raju
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  gender: {
    type: String,
  },
  casteCategory: {
    type: String,
  },
  aadharNumber: {
    type: Number,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  registrationDate: {
    type: Date, //The current registration date
  },
  child_id: {
    type: String,
  },
  cci_id: {
    type: String, //cci_id from the cciSchema
  },
  cwc_id: {
    type: String, //cwc_id from the cwcSchema
  },

  religion: {
    type: String,
  },
  eligibilityStatus: {
    type: String,
  },
  witness_id: {
    //employee_id from the cwcEmployeeSchema
    type: String,
  },
  guardian_id: [
    {
      type: String, //guardian_id from the guardianSchema
    },
  ],
  medicalDetails: {
    bloodGroup: {
      type: String,
    },
    height: [
      {
        date: {
          type: String,
        },
        value: {
          type: Number,
        },
      },
    ],
    weight: [
      {
        date: {
          type: String,
        },
        value: {
          type: Number,
        },
      },
    ],
  },
});

module.exports = mongoose.model("Child", childSchema);
