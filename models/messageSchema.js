var mongoose = require("mongoose");

var MessageSchema= new mongoose.Schema(
  {
    cci_id: {
      type: String
    },
    cwc_id: {
      type: String
    },

    //  timestamps: { createdAt: 'created_at' },
    Messages: [
      {
        description: String,
        subject: String,
        employee_id: String,
        sender: String,//cwc or cci
        time: {
          type: Number, default:  (new Date()).getTime()
        }
      }
    ]
  }
  );

  module.exports = mongoose.model("Message", MessageSchema);
  