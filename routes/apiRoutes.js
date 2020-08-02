const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var request = require("request");
const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.post("/dekstopLogin/", async (req, res) => {
  const cci_employee = await CciEmployee.findOne({
    email: req.body.email,
  });

  //checking if Password is valid
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    cci_employee.password
  );

  const child = await Child.find({ cci_id: cci_employee.cci_id });
  if (isPasswordValid) {
    jwt.sign({}, "secretKey", (err, token) => {
      const dataToSend = [token, child];
      console.log(dataToSend);
      res.json(dataToSend);
    });
  } else {
    res.sendStatus(403);
  }
});

router.get("/childrenDataUpdate/:cci_id", verifyToken, async (req, res) => {
  const child = await Child.find({ cci_id: req.params.cci_id });
  console.log(child);
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json(child);
    }
  });
});

router.post(
  "/postAttendance/:email/:password",
  verifyToken,
  async (req, res) => {
    const employee = await CciEmployee.findOne({ email: req.params.email });
    const cci = Cci.findOne({ cci_id: employee.cci_id });
    obj = JSON.parse(JSON.stringify(req.body));

    jwt.verify(req.token, "secretKey", (err) => {
      if (err) {
        res.sendStatus(403);
      }
    });

    try {
      const result = await Cci.updateOne(
        { cci_id: employee.cci_id },
        { $push: { attendance: obj } }
      );
      res.send(result);
    } catch (err) {}
    console.log(result);
  }
);

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

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    //Get Token from Array
    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
