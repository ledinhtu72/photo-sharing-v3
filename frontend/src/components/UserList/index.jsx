import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import "./styles.css";

function UserList () {
    const API_URL = process.env.REACT_APP_API_URL;

    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(`${API_URL}/api/user/list`);
        const data = await res.json();
        setUsers(data);
      };
      fetchData();
    }, []);

    return (
      <div>
        <List component="nav">
          {users.map((user) => (
            <div key={user._id}>
              <ListItemButton href={`/users/${user._id}`}>
                      <ListItemText primary={user.first_name}/>
              </ListItemButton>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    );
}

export default UserList;
