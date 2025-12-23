import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";

function UserComments() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`${API_URL}/api/user/${userId}/comments`);
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, [userId]);

  return (
    <div>
      <Typography variant="h5">User Comments</Typography>
      <Grid container spacing={2}>
        {comments.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.commentId}>
            <Box
              className="comment-card"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/photos/${c.photoId}`)}
            >
              <img src={`/images/${c.photoFile}`} className="thumb" alt="" />
              <Typography variant="body2">{c.comment}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserComments;
