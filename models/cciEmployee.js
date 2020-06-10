var mongoose = require("mongoose");

var CwcEmployeeSchema = new mongoose.Schema({
    employee_id     : String,
    firstName       : String,
    middleName      : String,
    lastName        : String,
    dateOfBirth     : {type : Date},
    contactNumber   : Number,
    emailId         : String,
    associatedCWC   : {
        id : {
			type : mongoose.Schema.Types.ObjectId,
			ref	 : "CWC"
        },
        cwc_id      : String
    }
});

module.exports = mongoose.model("CwcEmployee",CwcEmployeeSchema);