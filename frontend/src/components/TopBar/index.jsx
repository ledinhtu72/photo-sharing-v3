import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

function TopBar({ user, setUser }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const uploadRef = useRef(null);

  const handleClickUpload = () => {
    uploadRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Cannot upload this photo");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("userId", user._id);

    try {
      const res = await fetch(`${API_URL}/api/photo/upload`, {
        method: "POST",
        body: formData,
      });
      const savedPhoto = await res.json();
      navigate(`/photos/${savedPhoto._id}`);
    } catch (error) {
      console.error("Error uploading photo: " + error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          color="inherit"
          sx={{ flexGrow: 1, textDecoration: "none" }}
        >
          Lê Đình Tú B22DCAT261
        </Typography>
        <div id="right-topbar">
          {user ? (
            <>
              <Typography>
                Hi, {user.first_name} {user.last_name}!
              </Typography>
              <Button variant="contained" onClick={handleClickUpload}>
                UPLOAD PHOTO
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={uploadRef}
                onChange={handleUploadPhoto}
              />
              <Button variant="contained" onClick={handleLogout}>
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" href="/login">
                LOGIN
              </Button>
              <Button variant="contained" href="/register">
                REGISTER
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
