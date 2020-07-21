var mongoose = require("mongoose");

var cciEmployeeSchema = new mongoose.Schema({
    employee_id     : {
        type        : String,
    },
    firstName  : {
        type        : String,
    },
    middleName : {
        type        : String
    },
    lastName   : {
        type        : String
    },
    dateOfBirth : {
        type : String
    },
    contactNumber   : {
        type        : Number,
        min         : 1111111111,
        max         : 9999999999
    },
    email : {
        type        : String,
        required    : true,
        min         : 7,
        max         : 255
    },
    password : {
        type        : String,
        required    : true,
        max         : 1024,
        min         : 4
    },
    cwc_id : {
        type : String       //cwc_id from cwcSchema
    },
    cci_id : {
        type : String       //cci_id from cciSchema
    },
    registeredBy : {
        type : String       //employee_id from the cwcEmployeeSchema
    }
});

module.exports = mongoose.model("CciEmployee",cciEmployeeSchema);
