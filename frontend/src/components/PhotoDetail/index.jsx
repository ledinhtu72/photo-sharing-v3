import "./styles.css";
import { useEffect, useState } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

function PhotoDetail({ user }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const { photoId } = useParams();
    const [photo, setPhoto] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchPhoto = async () => {
            const res = await fetch(`${API_URL}/api/photo/detail/` + photoId);
            const data = await res.json();
            setPhoto(data);
        }
        fetchPhoto();
    }, [photoId]);

    if (!photo) {
        return <Typography>Loading...</Typography>;
    }

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            alert("Comment cannot be empty");
            return;
        }
        const res = await fetch(`${API_URL}/api/photo/detail/` + photoId + `/comment`, {
            method: "post",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ comment, user })
        });
        if (res.status === 200) {
            const updatedPhoto = await res.json();
            setPhoto(updatedPhoto);
            setComment("");
        } else {
            alert("Error adding comment");
        }
    }

    return (
        <div>
            <img src={`/images/${photo.file_name}`} className="photo-detail" alt="" />
            <br />
            <hr />
            <Typography variant="h5">COMMENTS</Typography>
            {photo.comments.map((comment) => (
                <div key={comment._id}>
                    <Link href={`/users/${comment.user._id}`}>
                        <strong>{comment.user.first_name} {comment.user.last_name}:</strong>
                    </Link>
                    <Typography>{comment.comment}</Typography>
                    <Typography variant="caption">
                        {new Date(comment.date_time).toLocaleString()}
                    </Typography>
                </div>
            ))}
            <hr />
            <br />
            <Box component="form" onSubmit={handleComment}>
                <TextField
                    label="Comment"
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                />
                <br />
                <br />
                <Button variant="contained" type="submit">Add comment</Button>
            </Box>
        </div>
    );
}

export default PhotoDetail;

