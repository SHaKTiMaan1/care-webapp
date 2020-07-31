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
  head_name: {
    type: String, //employee_id from the cciEmployeeSchema
  },
  mcuHead_id: {
    type: String,
  },
  mcuHead_name: {
    type: String,
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
  strength: {
    type: Number,
  },
  noOfChildrenEligibleForAdoption: {
    type: Number,
  },
  noOfChildrenInWaitingList: {
    type: Number,
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
          reasonOfAbsence: {
            type: String,
          },
        },
      ],
    },
  ],
  in_out_movement: [
    {
      child_id: {
        type: String,
      },
      date_out: {
        type: String,
      },
      time_out: {
        type: String,
      },
      date_in: {
        type: String,
      },
      time_in: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Cci", cciSchema);
