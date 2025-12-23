const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/list", async (request, response) => {
  try {
    const users = await User.find();

    // For each user, compute photoCount and commentCount
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const photoCount = await Photo.countDocuments({ user_id: u._id });

        // Count comments authored by this user across all photos
        const commentCountAgg = await Photo.aggregate([
          { $unwind: "$comments" },
          { $match: { "comments.user._id": u._id } },
          { $count: "count" },
        ]);
        const commentCount =
          commentCountAgg.length > 0 ? commentCountAgg[0].count : 0;

        return { ...u.toObject(), photoCount, commentCount };
      })
    );

    response.json(usersWithCounts);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const user = await User.findOne({ _id: id });
  response.json(user);
});

router.get("/:id/comments", async (request, response) => {
  try {
    const { id } = request.params;
    // Find all photos that have comments by this user
    const photos = await Photo.find({ "comments.user._id": id });

    const comments = [];
    photos.forEach((photo) => {
      photo.comments.forEach((c) => {
        if (c.user && c.user._id && c.user._id.toString() === id) {
          comments.push({
            commentId: c._id,
            photoId: photo._id,
            photoFile: photo.file_name,
            comment: c.comment,
            date_time: c.date_time,
          });
        }
      });
    });

    response.json(comments);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
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
