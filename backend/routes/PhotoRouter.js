const express = require("express");
const multer = require("multer");
const path = require("path");
const Photo = require("../db/photoModel");
const router = express.Router();
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

router.get("/list", async (request, response) => {
    const photos = await Photo.find();
    response.json(photos);
});

router.get("/:userId", async (request, response) => {
    const { userId } = request.params;
    const photos = await Photo.find({user_id: userId});
    response.json(photos);
});

router.post("/upload", upload.single('photo'), async (request, response) => {
    try {
        const newPhoto = new Photo({
            file_name: request.file.filename,
            date_time: new Date(),
            user_id: request.body.userId
        });
        
        const savedPhoto = await newPhoto.save();
        response.status(200).json(savedPhoto);
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

router.get("/detail/:photoId", async (request, response) => {
    const { photoId } = request.params;
    const photo = await Photo.findOne({_id: photoId});
    response.json(photo);
});

router.post("/detail/:photoId/comment", async (request, response) => {
    const { photoId } = request.params;
    const { comment, user } = request.body;
    const date_time = new Date();
    const photo = await Photo.findOne({_id: photoId});
    photo.comments.push({comment, date_time, user});
    await photo.save();
    response.json(photo);
});

module.exports = router;
