const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (request, response) => {
  const users = await User.find();
  response.json(users);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const user = await User.findOne({ _id: id });
  response.json(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    return res.status(200).json(user).message;
  } else {
    return res.status(401).json({ message: "Wrong username or password" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "Register successfully" });
  } catch (err) {
    res.status(400).json({ message: "Register failed" });
  }
});



module.exports = router;