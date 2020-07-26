const mongoose = require("mongoose");

var cciSchema = new mongoose.Schema({
  cci_id: {
    type: String,
  },
  cci_name: {
    type: String,
  },
  address: {
    type: String,
  },
  district: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  head_id: {
    type: String, //employee_id from the cciEmployeeSchema
  },
  contactNumber: {
    type: Number,
  },
  email: {
    type: String,
  },
  cwc_id: {
    type: String,
  },
  registeredBy: {
    type: String,
  },
  attendance: [
    {
      date: {
        type: String,
      },
      data: [
        {
          C_Id: {
            type: String,
          },
          firstName: {
            type: String,
          },
          lastName: {
            type: String,
          },
          present: {
            type: Boolean,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Cci", cciSchema);
