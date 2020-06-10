var mongoose = require("mongoose");

var CwcSchema = new mongoose.Schema({
    cwc_id   : String,
    address  : String,
    district : String,
    state    : String,
    pincode  : Number,
    chairman : {
        id : {
			type : mongoose.Schema.Types.ObjectId,
			ref	 : "CWC"
        },
        employee_id     : String,
        firstName       : String,
        middleName      : String,
        lastName        : String,
        contactNumber   : Number,
        emailId         : String,
    }
});

module.exports = mongoose.model("Cwc", CwcSchema);