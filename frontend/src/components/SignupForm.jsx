import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import AuthService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SignupForm = ({ setAppSnackbarOpen, setAppSnackbarText }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailUsername, setEmailUsername] = useState("");
  const [sendEmail, setSendEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [accountType, setAccountType] = React.useState("volunteer");
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleResetClose = () => {
    setOpen(false);
  };

  const handleChangeAccountType = (event) => {
    setAccountType(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const is_volunteer = accountType === "volunteer";
    const request = {
      username: username,
      email: email,
      password: password,
      is_volunteer: is_volunteer,
    };
    AuthService.createUser(request)
      .then((response) => {
        console.log("User registered successfully");
        setAppSnackbarText(
          "If the email exist, an activation link has been sent."
        );
        setAppSnackbarOpen(true);
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        let msg = "";
        if (err.response) {
          Object.values(err.response.data).forEach((x) => (msg += x));
          console.log(err.response);
        } else {
          msg = "Failed to get response from server.";
        }
        setSnackbarText(msg);
        setSnackbarOpen(true);
      });
  };

  const sendNewLink = (e) => {
    e.preventDefault();

    const request = { username: emailUsername, email: sendEmail };

    AuthService.sendNewEmail(request)
      .then((response) => {
        setOpen(false);

        console.log("New link is sent");
        setEmailUsername("");
        setSendEmail("");
        setAppSnackbarText("If the user exist, a link has been sent.");
        setAppSnackbarOpen(true);
      })
      .catch((err) => {
        console.log("New link request failed");
    });
  };  

  return (
    <>
      <Container maxWidth='xs'>
        <form onSubmit={onSubmit}>
          <Stack spacing={2} padding={2}>
            <img alt='logo' src='logo512primary.png' />

            <FormControl>
              <FormLabel id='row-radio-buttons-group-label'>
                Account type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={accountType}
                onChange={handleChangeAccountType}
              >
                <FormControlLabel
                  value='volunteer'
                  control={<Radio />}
                  label='Volunteer'
                />
                <FormControlLabel
                  value='refugee'
                  control={<Radio />}
                  label='Refugee'
                />
              </RadioGroup>
            </FormControl>
            <TextField
              required
              label='Username'
              onInput={(e) => setUsername(e.target.value)}
              value={username}
            />
            <TextField
              required
              label='E-mail'
              onInput={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
            />

            <TextField
              required
              label='Password'
              type='password'
              onInput={(e) => setPassword(e.target.value)}
              value={password}
            ></TextField>
            <Button variant='contained' type='submit'>
              Sign Up
            </Button>
            <Link
              component='button'
              underline='hover'
              onClick={() => navigate("/login")}
            >
              Already registered? Click here to sign in!
            </Link>
            <Link
              component='button'
              underline='hover'
              onClick={handleClickOpen}
            >
              Need New Activation-link?
            </Link>
          </Stack>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: "100%" }}>
            {snackbarText}
          </Alert>
        </Snackbar>

        <Dialog open={open} onClose={handleResetClose}>
          <form onSubmit={sendNewLink}>
            <DialogTitle>Need New Activation-link?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To receive a new activation-link, please enter your email and
                username.
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Email Address'
                type='email'
                onInput={(e) => setSendEmail(e.target.value)}
                value={sendEmail}
                fullWidth
                variant='standard'
                required
              />
              <TextField
                autoFocus
                required
                margin='dense'
                id='name'
                onInput={(e) => setEmailUsername(e.target.value)}
                value={emailUsername}
                label='Username'
                fullWidth
                variant='standard'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResetClose}>Cancel</Button>
              <Button type='submit'>Submit</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </>
  );
};

export default SignupForm;
