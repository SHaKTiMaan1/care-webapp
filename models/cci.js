const mongoose = require('mongoose');
var cciSchema = new mongoose.Schema({
    cci_id : {
        type : String,
    },
    address : {
        type : String,
    },
    district : {
        type : String,
    },
    state : {
        type : String,  
    },
    pincode : {
        type : Number, 
    },
    head_id : {
        type : String,  //employee_id from the cciEmployeeSchema
    },
    attendence : [
        {
            child_id : {
                type : String
            },
            firstName  : {
                type        : String,
            },
            lastName   : {
                type        : String
            },
            date : {
                type : String
            },
            present : {
                type : boolean
            }
        }
    ]
});