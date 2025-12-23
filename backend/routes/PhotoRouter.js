const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Photo = require("../db/photoModel");
const router = express.Router();
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../frontend/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/list", async (request, response) => {
  const photos = await Photo.find();
  response.json(photos);
});

router.get("/:userId", async (request, response) => {
  const { userId } = request.params;
  const photos = await Photo.find({ user_id: userId });
  response.json(photos);
});

router.post("/upload", upload.single("photo"), async (request, response) => {
  try {
    const newPhoto = new Photo({
      file_name: request.file.filename,
      date_time: new Date(),
      user_id: request.body.userId,
    });

    const savedPhoto = await newPhoto.save();
    response.status(200).json(savedPhoto);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get("/detail/:photoId", async (request, response) => {
  const { photoId } = request.params;
  const photo = await Photo.findOne({ _id: photoId });
  response.json(photo);
});

router.post("/detail/:photoId/comment", async (request, response) => {
  const { photoId } = request.params;
  const { comment, user } = request.body;
  const date_time = new Date();
  const photo = await Photo.findOne({ _id: photoId });
  photo.comments.push({ comment, date_time, user });
  await photo.save();
  response.json(photo);
});

router.delete("/:photoId", async (request, response) => {
  try {
    const { photoId } = request.params;
    const { userId } = request.body;
    const photo = await Photo.findOne({ _id: photoId });

    if (!photo) {
      return response.status(404).json({ message: "Photo not found" });
    }

    // Check if user is the owner of the photo
    if (photo.user_id.toString() !== userId) {
      return response
        .status(403)
        .json({ message: "Only the photo owner can delete this photo" });
    }

    // Delete file from filesystem
    const filePath = path.join(
      __dirname,
      "../../frontend/public/images",
      photo.file_name
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Photo.deleteOne({ _id: photoId });
    response.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.delete("/:photoId/comment/:commentId", async (request, response) => {
  try {
    const { photoId, commentId } = request.params;
    const { userId } = request.body;
    const photo = await Photo.findOne({ _id: photoId });

    if (!photo) {
      return response.status(404).json({ message: "Photo not found" });
    }

    const comment = photo.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the owner of the comment
    if (comment.user._id.toString() !== userId) {
      return response
        .status(403)
        .json({ message: "Only the comment owner can delete this comment" });
    }

    // Remove comment from array
    photo.comments.id(commentId).deleteOne();
    await photo.save();
    // Return the updated photo so frontend can refresh state
    response.status(200).json(photo);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

module.exports = router;
