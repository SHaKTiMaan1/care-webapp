var mongoose = require("mongoose");

var nationalOfficialSchema = new mongoose.Schema({
  employee_id: {
    type: String,
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
  state: {
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
  registeredBy: {
    type: String,
  },
});

module.exports = mongoose.model("NationalOfficial", nationalOfficialSchema);
