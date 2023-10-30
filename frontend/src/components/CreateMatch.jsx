import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import MatchesService from '../services/matches';
import AuthService from '../services/auth';

const CreateMatch = () => {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    field: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    AuthService.fetchTeams()
      .then(response => {
        setTeams(response);
      })
      .catch(error => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    MatchesService.AddMatch(formData)
      .then(response => {
        console.log("Match added successfully:", response);
        // Handle success, e.g., show a success message or redirect to another page
      })
      .catch(error => {
        console.error("Error adding match:", error);
        // Handle error, e.g., show an error message
      });
  };

  return (
    <Container maxWidth='md'>
      <Typography sx={{ textAlign: 'center', marginTop: 3 }} variant='h2'>
        Create Match
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Team 1"
          name="team1"
          variant="outlined"
          required
          select
          value={formData.team1}
          onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Team 2"
          name="team2"
          variant="outlined"
          required
          select
          value={formData.team2}
          onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Field"
          name="field"
          variant="outlined"
          required
          value={formData.field}
          onChange={(e) => setFormData({ ...formData, field: e.target.value })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Date"
          type="date"
          name="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Time"
          type="time"
          name="time"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          required
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default CreateMatch;

