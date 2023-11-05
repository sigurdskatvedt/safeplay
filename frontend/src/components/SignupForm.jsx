import React, { useEffect, useState } from "react";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SignupForm = ({ setAppSnackbarOpen, setAppSnackbarText }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [guardianUsername, setGuardianUsername] = useState("");
  const [showGuardianField, setShowGuardianField] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [sendEmail, setSendEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [birthdate, setBirthdate] = React.useState(new Date().toISOString().split('T')[0]);
  const [userType, setUserType] = React.useState("player");
  const [open, setOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    // Make an API call to fetch teams
    AuthService.fetchTeams()
      .then(response => {
        setTeams(response);
      })
      .catch(error => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  useEffect(() => {
    const age = calculateAge(birthdate);
    setShowGuardianField(age < 15);
  }, [birthdate]);

  const handleChangeUserType = (event) => {
    setUserType(event.target.value);
  };

  const handleAddTeam = () => {
    const request = newTeamName;

    AuthService.createTeam(request)
      .then((response) => {
        console.log(response);
        // Update the local teams array with the new team
        setTeams(prevTeams => [...prevTeams, response]);
        console.log(teams);

        // Set the currentTeam to the new team's id
        setCurrentTeam(response.id);

        setSnackbarText("Team created successfully!");
        setSnackbarType("success");
        setSnackbarOpen(true);
        setNewTeamName('');
        handleCloseTeamDialog();
      })
      .catch((err) => {
        // Since our mock API always succeeds, this code won't run.
        // But it's here for completeness.
        setSnackbarText("Failed to create team.");
        setSnackbarType("error");
        setSnackbarOpen(true);
        console.log(err);
      });

    // Clear the new team name and close the dialog
    setNewTeamName('');
    handleCloseTeamDialog();
    console.log(teams);
  };

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

  const handleChangeAccountBirth = (event) => {
    setBirthdate(event.target.value.split('T')[0]);
  };

  const handleTeamChange = (event) => {
    setCurrentTeam(event.target.value);
  };

  const handleOpenTeamDialog = () => {
    setIsTeamDialogOpen(true);
  };

  const handleCloseTeamDialog = () => {
    setIsTeamDialogOpen(false);
  };


  const onSubmit = (e) => {
    e.preventDefault();

    const request = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      user_type: userType, // Send the selected user type to the backend
      birthdate: birthdate,
      team_id: currentTeam,
      guardian_username: showGuardianField ? guardianUsername : undefined,
    };
    AuthService.createUser(request)
      .then((response) => {
        console.log("User registered successfully");
        setSnackbarText(
          "If the email exists, an activation link has been sent."
        );
        setSnackbarType("success");
        setSnackbarOpen(true);
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
        setSnackbarType("error");
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
              <FormLabel id="user-type-radio-group-label">User Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="user-type-radio-group-label"
                name="user-type-radio-group"
                value={userType}
                onChange={handleChangeUserType}
              >
                <FormControlLabel value="player" control={<Radio />} label="Player" />
                <FormControlLabel value="guardian" control={<Radio />} label="Guardian" />
                <FormControlLabel value="manager" control={<Radio />} label="Manager" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Team</FormLabel>
              <Box display="flex" alignItems="center">
                <Select
                  value={currentTeam}
                  onChange={handleTeamChange}
                  fullWidth
                  style={{ flexGrow: 1 }}
                >
                  {teams.map((teamItem) => (
                    <MenuItem key={teamItem.id} value={teamItem.id}>
                      {teamItem.name}
                    </MenuItem>
                  ))}
                </Select>
                {userType === "manager" && (
                  <>
                    <IconButton onClick={handleOpenTeamDialog} size="small">
                      <AddIcon />
                    </IconButton>
                    <Dialog open={isTeamDialogOpen} onClose={handleCloseTeamDialog}>
                      <DialogTitle>Create a New Team</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Please enter the name for the new team.
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin='dense'
                          id='teamName'
                          label='Team Name'
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          fullWidth
                          variant='standard'
                          required
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseTeamDialog} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={handleAddTeam} color="primary">
                          Add
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </Box>
            </FormControl>
            {userType === 'player' && (
              <>
                <TextField
                  label="Birthday"
                  type="date"
                  onChange={handleChangeAccountBirth}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={birthdate}
                  required
                />
                {showGuardianField && (
                  <TextField
                    required
                    label="Guardian's Username"
                    onInput={(e) => setGuardianUsername(e.target.value)}
                    value={guardianUsername}
                  />
                )}
              </>
            )}
            <TextField
              required
              label='First Name'
              onInput={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
            <TextField
              required
              label='Last Name'
              onInput={(e) => setLastName(e.target.value)}
              value={lastName}
            />
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
          <Alert onClose={handleClose} severity={snackbarType} sx={{ width: "100%" }}>
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
