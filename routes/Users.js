const express = require("express");
const bcrypt = require("bcrypt");
const users = express.Router();
const _ = require("lodash");
const Joi = require("@hapi/joi");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
users.use(cors());
process.env.SECRET_KEY = "secret";

const schemaRegister = Joi.object({
  first_name: Joi.string().min(5).max(50).required(),
  last_name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  dateOfBirth: Joi.date().iso().required(),
  phoneNo: Joi.string().min(10).max(10).required(),
  password: Joi.string().min(5).max(255).required(),
});

users.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(6);
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today,
  };

  User.findOne({
    email: req.body.email,
  })
    //TODO bcrypt
    .then((user) => {
      if (!user) {
        User.create(userData)
          .then((user) => {
            const payload = {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
            };
            let token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: 1440,
            });
            res.json({ token: token });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "User already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

users.post("/login", async (req, res) => {
  let user = User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("No such user with email: " + req.body.email);

  const validPassword = req.body.password === user.password ? true : false;
  if (!validPassword)
    return res.status(400).send("Incorrect email or password.");

  const payload = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: 1440,
  });

  //Send the jwt with id as it can be used to get user details
  const body = { token: token };
  res.status(200).send(body);

  // User.findOne({
  //   email: req.body.email,
  // })
  //   .then((user) => {
  //     if (user) {
  //       const payload = {
  //         _id: user._id,
  //         first_name: user.first_name,
  //         last_name: user.last_name,
  //         email: user.email,
  //       };
  //       let token = jwt.sign(payload, process.env.SECRET_KEY, {
  //         expiresIn: 1440,
  //       });
  //       res.json({ token: token });
  //     } else {
  //       res.json({ error: "User does not exist" });
  //     }
  //   })
  //   .catch((err) => {
  //     res.send("error: " + err);
  //   });
});

users.get("/profile", (req, res) => {
  var decoded = jwt.verify(
    req.headers["authorization"],
    process.env.SECRET_KEY
  );

  User.findOne({
    _id: decoded._id,
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.send("User does not exist");
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

module.exports = users;
