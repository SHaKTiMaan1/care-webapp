var mongoose = require("mongoose");

var reportSchema = new mongoose.Schema({
  district : String,
  date : String,
  SenderDetails: [
    {
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
        type: Number
        
      },
      email: {
        type: String,
        required: true,
        min: 7,
        max: 255,
      },
      address:{
        type : String
      },
      gender:{
        type: String
      }
    }
  ],
  subject:{
    type:String
  },
  description:{
    type: String
  }
})

module.exports = mongoose.model("report", reportSchema);