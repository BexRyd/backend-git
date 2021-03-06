var marvel = require("marvel-comics-characters");
const credentials = { secretUser: "user", secretPassword: "password" };

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

//const https = require("https");
const fs = require("fs");
const auditlog = require("audit-log/lib/auditlog");

console.log(marvel.random());
const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

/*auditlog.addTransport("mongoose", {
  connectionString: "mongodb:localhost:27017/jensen-backend",
});*/

//auditLog.addTransport("console");

let options = {
  key: fs.readFileSync("rebecca-key.pem"),
  cert: fs.readFileSync("rebecca-cert.pem"),
};

/*app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});
*/

app.use("/healthcheck", require("./routes/healthcheck.routes"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-cache" };
  body = { status: "available" };
  res.status(200).send(body);
});

app.get("/health", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-cache" };
  body = { status: "available" };
  res.status(200).send(body);
});

app.post("/authorize", (req, res) => {
  // Insert Login Code Here
  let user = req.body.user;
  let password = req.body.password;
  console.log(`User ${user}`);
  console.log(`Password ${password}`);

  if (
    user === credentials.secretUser &&
    password === credentials.secretPassword
  ) {
    auditlog.addTransport("console");
    auditlog.logEvent(
      `user with the credentials ${user} and password ${password} just logged in`,
      "https://rebecca-backend.herokuapp.com/authorize",
      "logged in"
    );

    console.log("Authorized");
    const token = jwt.sign(
      {
        data: "foobar",
      },
      "your-secret-key-here",
      { expiresIn: 60 * 60 }
    );

    console.log(token);
    res.status(200).send(token);
  } else {
    console.log("Not authorized");
    res.status(200).send({ STATUS: "FAILURE" });
  }
});

app.listen(PORT, () => {
  console.log(`STARTED LISTENING ON PORT ${PORT}`);
});

/*https.createServer(options, app).listen(443, function () {
  console.log("https listening on port 443");
});
*/
