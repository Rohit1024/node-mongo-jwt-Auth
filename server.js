var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const update = require("./routes/update");
var port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

const mongoURI = 'mongodb://localhost/mongo-auth'

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

var Users = require('./routes/Users')

// app.use('/users', Users)
app.use("/api/auth", register);
app.use("/api/auth", login);
app.use("/api/auth", profile);
app.use("/api/auth", update);

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})