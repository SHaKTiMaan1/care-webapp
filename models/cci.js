const mongoose = require("mongoose");
var cciSchema = new mongoose.Schema({
  cci_id: {
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
          middleName: {
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
