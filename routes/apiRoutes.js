const router = require("express").Router();
const bcrypt = require("bcryptjs");
var request = require("request");
const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.get(
  "/firstTimeLogin/:employeeEmail/:hashedPassword",
  async (req, res) => {
    const cci_employee = await CciEmployee.findOne({
      email: req.params.employeeEmail,
    });
    console.log(cci_employee);
    passwordToCompare = myStr.replace(/%2F/g, "/");

    //checking if Password is valid

    const isPasswordValid = false;
    if (req.params.passwordToCompare === cci_employee.password) {
      isPasswordValid = true;
    }

    // const isPasswordValid = await bcrypt.compare(
    //   req.params.passwordToCompare,
    //   cci_employee.password
    // );

    if (isPasswordValid) {
      const child = await Child.find({ cci_id: cci_employee.cci_id });
      res.send(child);
    } else {
      res.sendStatus(401);
    }
  }
);

router.get(
  "/firstTimeLoginPlain/:employeeEmail/:Password",
  async (req, res) => {
    const cci_employee = await CciEmployee.findOne({
      email: req.params.employeeEmail,
    });
    console.log(req.params.Password);

    //checking if Password is valid
    const isPasswordValid = await bcrypt.compare(
      req.params.Password,
      cci_employee.password
    );

    const child = await Child.find({ cci_id: cci_employee.cci_id });
    if (isPasswordValid) {
      res.send(child);
    } else {
      res.sendStatus(401);
    }
  }
);

router.post("/postAttendance/:email/:password", async function (req, res) {
  // console.log(req.body);
  const employee = await CciEmployee.findOne({ email: req.params.email });
  obj = JSON.parse(JSON.stringify(req.body));
  console.log(employee);
  console.log(req.body);
  console.log(obj);
  console.log("request received");
  const result = await Cci.updateOne(
    { cci_id: employee.cci_id },
    { $push: { attendance: obj } }
  );
  // console.log(result);
  res.send("done");
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
