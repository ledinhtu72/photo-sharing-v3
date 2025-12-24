import "./styles.css";
import { useEffect, useState } from "react";
import {
  Box,
        <Button
          variant={photo.likes && photo.likes.some((id) => id.toString() === user._id) ? "contained" : "outlined"}
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams, useNavigate } from "react-router-dom";

function PhotoDetail({ user }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const { photoId } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPhoto = async () => {
      const res = await fetch(`${API_URL}/api/photo/detail/` + photoId);
      const data = await res.json();
      setPhoto(data);
    };
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
    const res = await fetch(
      `${API_URL}/api/photo/detail/` + photoId + `/comment`,
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, user }),
      }
    );
    if (res.status === 200) {
      const updatedPhoto = await res.json();
      setPhoto(updatedPhoto);
      setComment("");
    } else {
      alert("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/photo/${photoId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      if (res.status === 200) {
        const updatedPhoto = await res.json();
        setPhoto(updatedPhoto);
      } else {
        alert("Error deleting comment");
      }
    } catch (error) {
      alert("Error deleting comment: " + error.message);
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await fetch(`${API_URL}/api/photo/${photoId}/like`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.status === 200) {
        const updatedPhoto = await res.json();
        setPhoto(updatedPhoto);
      } else {
        alert("Error toggling like");
      }
    } catch (error) {
      alert("Error toggling like: " + error.message);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/photo/` + photoId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.status === 200) {
        alert("Photo deleted successfully");
        navigate("/");
      } else {
        alert("Error deleting photo");
      }
    } catch (error) {
      alert("Error deleting photo: " + error.message);
    }
  };

  return (
    <div>
      <img src={`/images/${photo.file_name}`} className="photo-detail" alt="" />
      <br />
      {user && user._id === photo.user_id && (
        <Box sx={{ marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeletePhoto}
          >
            Delete Photo
          </Button>
        </Box>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
        <Button
          variant={
            photo.likes && photo.likes.includes(user._id)
              ? "contained"
              : "outlined"
          }
          color="primary"
          startIcon={<FavoriteIcon />}
          onClick={handleToggleLike}
        >
          {photo.likes ? photo.likes.length : 0}
        </Button>
      </Box>
      <hr />
      <Typography variant="h5">COMMENTS</Typography>
      {photo.comments.map((comment) => (
        <div key={comment._id}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link href={`/users/${comment.user._id}`}>
              <strong>
                {comment.user.first_name} {comment.user.last_name}:
              </strong>
            </Link>
            {user && user._id === comment.user._id && (
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteComment(comment._id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
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
        <Button variant="contained" type="submit">
          Add comment
        </Button>
      </Box>
    </div>
  );
}

export default PhotoDetail;
