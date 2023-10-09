import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const CreateMatch = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you would handle the form submission logic, e.g., saving the match to a database.
    const { team1, team2, field, date, time } = event.target.elements;
    console.log({
      team1: team1.value,
      team2: team2.value,
      field: field.value,
      date: date.value,
      time: time.value
    });
  };

  return (
    <Container maxWidth='md'>
      <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h2'>
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
        />
        <TextField
          fullWidth
          margin="normal"
          label="Team 2"
          name="team2"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Field"
          name="field"
          variant="outlined"
          required
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

