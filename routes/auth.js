const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requiredLogin');



// router.post("/signout", (req, res) => {
//   // Clear the JWT token from the client-side
//   res.clearCookie('jwtToken'); // Clear the JWT token stored in cookies, if any
//   res.status(200).json({ message: 'Signed out successfully' });
// });

router.post("/signup", (req, res) => {
  const { name, email, password, pic} = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      bcrypt.hash(password, 13).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })

    .catch((er) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please enter email and password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt.compare(password, savedUser.password).then((doMatch) => {
      if (doMatch) {
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
        const { _id, name, email, followers, following, pic } = savedUser;
        res.json({ message: "Login successful", token, user: { _id, name, email, followers, following, pic } });
      } else {
        return res.status(422).json({ error: "Invalid email or password" });
      }
    });
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  });
});


module.exports = router;
