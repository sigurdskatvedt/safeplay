import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import SignupForm from "./components/SignupForm";
import Matches from "./components/Matches";
import CreateMatch from "./components/CreateMatch";
import ConsentRequests from "./components/ConsentRequests";
import ResetPassword from "./components/ResetPassword";
import Verified from "./components/Verified";
import Invalid from "./components/Invalid";
import Object from "./components/Object";
import AuthService from "./services/auth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const App = () => {
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const signOut = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      console.log(user);
    }
  }, []);

  return (
    <Router>
      <AppBar position='static'>
        <Toolbar>
          <Grid container>
            <Grid item>
              <Button size='small' component={Link} to='/'>
                <Avatar alt='Home' src='favicon.ico' />
              </Button>
            </Grid>
            {user?.is_manager ? (
              <Grid item marginTop={0.8}>
                <Button color='inherit' component={Link} to='/matches'>
                  Overview
                </Button>
              </Grid>
            ) : null}

            {user?.is_manager ? (
              <Grid item marginTop={0.8}>
                <Button color='inherit' component={Link} to='/creatematch'>
                  Create New Match
                </Button>
              </Grid>
            ) : null}
            {user?.id ? (
              <Grid item marginTop={0.8}>
                <Button color='inherit' component={Link} to='/object'>
                  Object
                </Button>
              </Grid>
            ) : null}
            {user?.id ? (
              <Grid item marginTop={0.8}>
                <Button color='inherit' component={Link} to='/consent-requests'>
                  Consent Requests
                </Button>
              </Grid>
            ) : null}
          </Grid>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              {user ? (
                <Button
                  color='inherit'
                  onClick={signOut}
                  component={Link}
                  to='/login'
                >
                  Sign Out
                </Button>
              ) : (
                <div>
                  <Button color='inherit' component={Link} to='/login'>
                    Sign In
                  </Button>
                  <Button
                    variant='outlined'
                    color='inherit'
                    component={Link}
                    to='/signup'
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth='xl'>
        <Routes>
          <Route
            path='/matches'
            element={<Matches user={user} />}
          />
          <Route
            path='/creatematch'
            element={<CreateMatch user={user} />}
          />
          <Route path='/consent-requests' element={<ConsentRequests user={user} />} />

          <Route
            path='login'
            element={
              <LoginForm
                setAppSnackbarOpen={setSnackbarOpen}
                setAppSnackbarText={setSnackbarText}
                setUser={setUser}
              />
            }
          />

          <Route
            path='/signup'
            element={
              <SignupForm
                setAppSnackbarOpen={setSnackbarOpen}
                setAppSnackbarText={setSnackbarText}
              />
            }
          />

          <Route path='/invalid' element={<Invalid />} />
          <Route path='/verified' element={<Verified />} />

          <Route path='/new_password' element={<ResetPassword />} />

          <Route path='/object' element={<Object />} />

          <Route path='/' element={<Home setUser={setUser} />} />
        </Routes>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity='success'
            sx={{ width: "100%" }}
          >
            {snackbarText}
          </Alert>
        </Snackbar>
      </Container>
    </Router>
  );
};

export default App;
