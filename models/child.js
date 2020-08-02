var mongoose = require("mongoose");

var childSchema = new mongoose.Schema({
  firstName: {
    type: String,
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
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  caste: {
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
  cci_name: {
    type: String, //cci_name from the cciSchema
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
    type: String,
  },
  witness_name: {
    type: String,
  },
  nextStatusEvaluationDate: {
    type: Date,
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
