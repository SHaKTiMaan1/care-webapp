const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var request = require("request");
const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.get(
  "/firstTimeLoginPlain/:employeeEmail/:Password",
  async (req, res) => {
    const cci_employee = await CciEmployee.findOne({
      email: req.params.employeeEmail,
    });

    //checking if Password is valid
    const isPasswordValid = await bcrypt.compare(
      req.params.Password,
      cci_employee.password
    );

    const child = await Child.find({ cci_id: cci_employee.cci_id });
    if (isPasswordValid) {
      jwt.sign({}, "secretKey", (err, token) => {
        res.json({
          token: token,
          child: child,
        });
      });
    } else {
      res.sendStatus(403);
    }
  }
);

router.get("/childrenDataUpdate/:cci_id", async (req, res) => {
  const cci = await Cci.findOne({
    cci_id: req.params.cci_id,
  });
  console.log(cci);
});

router.post("/postAttendance/:email/:password", async (req, res) => {
  console.log(req.body);
  const employee = await CciEmployee.findOne({ email: req.params.email });
  const cci = Cci.findOne({ cci_id: employee.cci_id });
  obj = JSON.parse(JSON.stringify(req.body));
  console.log(employee);
  console.log(req.body);
  console.log(obj);
  console.log("request received");
  try {
    const result = await Cci.updateOne(
      { cci_id: employee.cci_id },
      { $push: { attendance: obj } }
    );
    res.send("done" + result);
  } catch (err) {}
  console.log(result);
});

//For testing the above post req working or not

// var myJSONObject = [
//   {
//     date: "today",
//     data: [
//       {
//         child_Id: "something",
//         firstName: "something",
//         lastName: "something",
//         present: true,
//         reasonOfAbsence:"something",
//       },
//     ],
//   },
// ]  ;
// request({
//     url: "http://localhost:3001/postAttendance/mridul@mail.com/mridul12",
//     method: "POST",
//     json: true,   // <--Very important!!!
//     body: myJSONObject
// }, function (error, response, body){
//     console.log(response);
// });

module.exports = router;
