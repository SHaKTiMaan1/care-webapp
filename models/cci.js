var mongoose = require("mongoose");

var CciSchema = new mongoose.Schema({
    cwc_id      : String,
    address     : String,
    district    : String,
    state       : String,
    pincode     : Number,
    name        : String,
    institute_head : {
        id : {
			type : mongoose.Schema.Types.ObjectId,
			ref	 : "CciEmployee"
        },
        employee_id     : String,
        firstName       : String,
        middleName      : String,
        lastName        : String,
        contactNumber   : Number,
        emailId         : String,
    },
    parentCWC   : {
        id : {
			type : mongoose.Schema.Types.ObjectId,
			ref	 : "Cwc"
        },
        cwc_id      : String
    }
});

module.exports = mongoose.model("Cci", CciSchema);