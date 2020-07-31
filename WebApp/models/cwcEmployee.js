var mongoose = require("mongoose");

var cwcEmployeeSchema = new mongoose.Schema({
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
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  aadharNumber: {
    type: String,
  },
  contactNumber: {
    type: Number,
    min: 1111111111,
    max: 9999999999,
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
  cwc_id: {
    type: String,
  },
  district: {
    type: String,
  },
  registeredBy: {
    type: String,
  },
});

module.exports = mongoose.model("CwcEmployee", cwcEmployeeSchema);
