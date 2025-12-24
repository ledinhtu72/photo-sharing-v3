import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";

function UserList() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_URL}/api/user/list`);
      const data = await res.json();
      setUsers(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search || search.trim() === "") {
        const res = await fetch(`${API_URL}/api/user/list`);
        const data = await res.json();
        setUsers(data);
        return;
      }
      const res = await fetch(
        `${API_URL}/api/user/search?q=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setUsers(data);
    };

    const t = setTimeout(fetchSearch, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div>
      <Box sx={{ padding: 1 }}>
        <TextField
          placeholder="Search users..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <List component="nav">
        {users.map((user) => (
          <div key={user._id}>
            <ListItemButton onClick={() => navigate(`/users/${user._id}`)}>
              <ListItemText primary={user.first_name} />
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={user.photoCount || 0}
                  color="success"
                  size="small"
                  clickable
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/${user._id}`);
                  }}
                />
                <Chip
                  label={user.commentCount || 0}
                  color="error"
                  size="small"
                  clickable
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/${user._id}/comments`);
                  }}
                />
              </Box>
            </ListItemButton>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;
