import "./styles.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [occupation, setOccupation] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/api/user/register`, {
            method: "post",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, first_name, last_name, location, description, occupation })
        })
        if (res.status === 200) {
            alert("Register successfully!");
            navigate("/login");
        } else {
            alert("Register failed");
        }
    }

    return (
        <Box id="register-box" component="form" onSubmit={handleRegister}>
            <Typography variant="h4">Register</Typography>
            <br />
            <TextField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="First name"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                label="Last name"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                label="Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
                label="Occupation"
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
            />
            <Button variant="contained" fullWidth type="submit">Register</Button>
        </Box>
    )
}

export default Register;