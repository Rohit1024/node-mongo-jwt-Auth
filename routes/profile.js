const { User } = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/profile", async (req, res) => {

  try{
    var decoded = jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
  }catch(e){
    res.status(500).send({error: e});
  }

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

module.exports = router;
