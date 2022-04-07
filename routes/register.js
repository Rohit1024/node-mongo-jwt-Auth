const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("@hapi/joi");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const schema = Joi.object({
  _id: Joi.string().allow(null, ''),
  first_name: Joi.string().min(5).max(50).required(),
  last_name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  dateOfBirth: Joi.date().iso().required(),
  phoneNo: Joi.string().min(10).max(10).required(),
  password: Joi.string().min(5).max(255).required(),
  profilePhoto: Joi.string().allow(null, ''),
  exp: Joi.number().allow(null, ''),
  iat: Joi.number().allow(null, '')
});

//Register route
router.post("/register", async (req, res) => {
  // First Validate The Request
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User with that email already exisits!");
  } else {
    // Insert the new user if they do not exist yet
    user = new User(
      _.pick(req.body, [
        "first_name",
        "last_name",
        "email",
        "password",
        "dateOfBirth",
        "phoneNo",
        "profilePhoto",
      ])
    );
    try {
      const salt = await bcrypt.genSalt(6);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const payload = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phoneNo: user.phoneNo,
        dateOfBirth: user.dateOfBirth,
        profilePhoto: user.profilePhoto,
      };
      let token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: 1440,
      });
      res
        .status(200)
        .send({ message: "User created successfully with Id : " + user.id, data: token });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
});

module.exports = router;

// const token = jwt.sign({ _id: user._id }, config.get("PrivateKey"));
    // res
    //   .header("Authorization", token)
    //   .send(
    //     _.pick(user, [
    //       "_id",
    //       "firstName",
    //       "lastName",
    //       "email",
    //       "password",
    //       "dateOfBirth",
    //       "phoneNo",
    //       "profilePhoto",
    //     ])
    //   );