var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  contactNumber: {
    type: Number,
    min: 1111111111,
    max: 9999999999,
  },
  aadharNumber: {
    type: Number,
    min: 111111111111,
    max: 999999999999,
  },
  email: {
    type: String,
    required: true,
    min: 7,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 4,
  },
  autherisation_level: {
    type: String,
  },
  registeredBy: {
    type: String,
  },
  eligibilityListCriteria: {
    ageLessThan2: {
      timeIntervalForEvaluation: {
        type: Number,
      },
      minDaysSinceRegistration: {
        type: Number,
      },
      minPresentDaysInCci: {
        type: Number,
      },
      averageGuardianVisits: {
        type: Number,
      },
      revelenceToBioParents: {
        type: String,
      },
    },
    ageMoreThan2: {
      timeIntervalForEvaluation: {
        type: Number,
      },
      minDaysSinceRegistration: {
        type: Number,
      },
      minPresentDaysInCci: {
        type: Number,
      },
      averageGuardianVisits: {
        type: Number,
      },
      revelenceToBioParents: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model("Admin", adminSchema);
