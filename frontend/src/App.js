import './App.css';

import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import PhotoDetail from './components/PhotoDetail';
import Login from './components/Login';
import { useState } from 'react';
import Register from './components/Register';
import Home from './components/Home';




const App = (props) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <Router>
      <div>
        <Grid container spacing={2} sx={{padding: '20px'}}>
          <Grid item xs={12}>
            <TopBar user={user} setUser={setUser} />
            <div className="main-topbar-buffer" />
          </Grid>
            {user ? (
              <>
                <Grid item sm={2}>
                  <Paper className="main-grid-item">
                    <UserList />
                  </Paper>
                </Grid>
                <Grid item sm={10}>
                  <Paper className="main-grid-item">
                    <Routes>
                      <Route
                        path="/"
                        element={<Home />}
                      />
                      <Route
                        path="/users/:userId"
                        element={<UserDetail />}
                      />
                      <Route
                        path="/photos/:photoId"
                        element={<PhotoDetail user={user} />}
                      />
                    </Routes>
                  </Paper>
                </Grid>
              </>
            ) : (
              <>
                <Grid item sm={12}>
                  <Paper className="main-grid-item">
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to={`/login`} replace />}
                      />
                      <Route
                        path="/login"
                        element={<Login setUser={setUser} />}
                      />
                      <Route
                        path="register"
                        element={<Register />}
                      />
                    </Routes>
                  </Paper>
                </Grid>
              </>
            )}
        </Grid>
      </div>
    </Router>
  );
}

export default App;
