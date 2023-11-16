import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import AuthService from '../services/auth';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const TeamCreation = () => {
  const [newTeamName, setNewTeamName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [teams, setTeams] = useState([]);
  const [newTeamDescription, setNewTeamDescription] = useState(''); // New state for team description

  const fetchTeams = () => {
    AuthService.fetchTeams()
      .then(data => {
        setTeams(data);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = () => {
    const request = {
      name: newTeamName,
      description: newTeamDescription // Include description in the request
    };

    AuthService.createTeam(request)
      .then(() => {
        setNewTeamName('');
        setNewTeamDescription(''); // Clear the description field
        fetchTeams(); // Refetch teams
        setSnackbarMessage('Team created successfully!');
        setSnackbarType('success');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage('Error creating team.');
        setSnackbarType('error');
        setSnackbarOpen(true);
      });
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <TableContainer component={Paper} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Team Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {team.name}
                </TableCell>
                <TableCell>{team.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h4" gutterBottom>
        Create a New Team
      </Typography>
      <TextField
        autoFocus
        margin='dense'
        id='teamName'
        label='Team Name'
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
        fullWidth
        variant='standard'
        requirel
      />
      <TextField
        margin='dense'
        id='teamDescription'
        label='Team Description'
        value={newTeamDescription}
        onChange={(e) => setNewTeamDescription(e.target.value)}
        fullWidth
        variant='standard'
        inputProps={{ maxLength: 255 }}
        required
      />
      <Button onClick={handleAddTeam} color="primary">
        Add Team
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeamCreation;

