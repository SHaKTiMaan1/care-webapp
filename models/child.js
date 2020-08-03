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
  isUpForAdoption: {
    type: Boolean,
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
  medicalDetails: {
    hairColor: {
      type: String,
    },
    eyeColor: {
      type: String,
    },
    skinColor: {
      type: String,
    },
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
    ordinaryDiseaseHistory: {
      whoopingCough: {
        type: Boolean,
      },
    },
    previousTreatments: [
      {
        hospitalName: {
          type: String,
        },
        age: {
          type: Number,
        },
        diagnosis: {
          type: String,
        },
        treatment: {
          type: String,
        },
      },
    ],

    jaundiceBtHistory: [
      {
        description: {
          type: String,
        },
        treatmentInfo: {
          type: String,
        },
      },
    ],
    vaccinatedFor: {
      TB: {
        type: Boolean,
      },
      diptheria: {
        type: Boolean,
      },
      tetanus: {
        type: Boolean,
      },
      poliomyelitis: {
        type: Boolean,
      },
      hepatitisA: {
        type: Boolean,
      },
      measels: {
        type: Boolean,
      },
    },
    mentalDevelopment: {
      type: String,
    },
  },
  guardian_id: [
    {
      type: String, //guardian_id from the guardianSchema
    },
  ],
});

module.exports = mongoose.model("Child", childSchema);
