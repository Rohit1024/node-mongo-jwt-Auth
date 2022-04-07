const { User } = require("../models/User");
const express = require("express");
const router = express.Router();

router.put("/update", async (req, res) => {
  try {
    var decoded = await jwt.verify(
      req.headers["authorization"],
      process.env.SECRET_KEY
    );
    const user = await User.findById(decoded._id);
    if (!user)
      res.send({ message: "User with id " + req.params.id + "not found" });
    else {
      let present = await User.findOne({ email: req.body.email });
      if (present)
        return res.status(409).send("User with that email already exisits!");
      User.findByIdAndUpdate(
        decoded._id,
        {
          $set: req.body,
        },
        { new: true },
        (error, data) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .send({ message: "Error while updating the user", error: error });
          } else {
            console.log("User updated successfully");
            return res
              .status(200)
              .json({ message: "User updated successfully", data: data });
          }
        }
      );
    }
  } catch (e) {
    res.send({ message: "Error in Fetching user", error: e });
  }
});

module.exports = router;
