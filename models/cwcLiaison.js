var mongoose = require("mongoose");

var cwcSchema = new mongoose.Schema({
    cwc_id      : String,
    address     : String,
    state       : String,
    pincode     : Number,
    chairman_id : String
});

module.exports = mongoose.model("CWC", cwcSchema);