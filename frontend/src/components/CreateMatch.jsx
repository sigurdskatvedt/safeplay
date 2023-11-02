import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import MatchesService from '../services/matches';
import AuthService from '../services/auth';
import FieldsService from '../services/fields';

const CreateMatch = () => {
  const [teams, setTeams] = useState([]);
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    field: '',
    date: '',
    time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // add user's timezone
  });

  useEffect(() => {
    AuthService.fetchTeams()
      .then((response) => {
        setTeams(response);
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });
  }, []);

  useEffect(() => {
    if (formData.field && formData.date) {
      FieldsService.FetchAvailableTimeSlots(formData.field, formData.date, formData.timezone)
        .then((response) => {
          const parsedResponse = response.map((timeSlot) => ({
            ...timeSlot,
            start_time: dayjs(timeSlot.start_time),
            end_time: dayjs(timeSlot.end_time),
          }));
          console.log(parsedResponse);
          setUnavailableTimeSlots(parsedResponse);
        })
        .catch((error) => {
          console.error('Error fetching available time slots:', error);
        });
    }
  }, [formData.field, formData.date, formData.timezone]);


  const handleSubmit = (event) => {
    event.preventDefault();
    MatchesService.AddMatch(formData)
      .then((response) => {
        console.log('Match added successfully:', response);
        // Handle success, e.g., show a success message or redirect to another page
      })
      .catch((error) => {
        console.error('Error adding match:', error);
        // Handle error, e.g., show an error message
      });
  };

  const handleTimeChange = (newValue) => {
    setFormData({ ...formData, time: newValue.format('HH:mm') });
  };

  const isTimeDisabled = (time) => {
    // Use formData.date as the date part of the time variable
    const date = formData.date;
    const newTime = time.year(date.year())
      .month(date.month())
      .date(date.date())


    // Use newTime in the rest of the function
    return unavailableTimeSlots.some((timeSlot) => {
      const startTime = new Date(timeSlot.start_time);
      const endTime = new Date(timeSlot.end_time - 60 * 1000);
      const timeHour = newTime.hour();
      console.log("date.date: ", date.date());
      console.log("startTime: ", startTime);
      console.log("newTime: ", newTime);
      return (
        timeHour >= startTime.getHours() &&
        timeHour <= endTime.getHours() &&
        newTime.date() === startTime.getDate() &&
        newTime.month() === startTime.getMonth() &&
        newTime.year() === startTime.getFullYear()
      );
    });
  };


  return (
    <Container maxWidth="md">
      <Typography sx={{ textAlign: 'center', marginTop: 3 }} variant="h2">
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newValue) => {
              setFormData({ ...formData, date: newValue });
            }}
            renderInput={(params) => <TextField {...params} />}
          />

          <TimePicker
            label="Time"
            value={formData.time}
            onChange={handleTimeChange}
            shouldDisableTime={isTimeDisabled}
            views={['hours']}
            ampm={false}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                name="time"
                variant="outlined"
                required
              />
            )}
          />
        </LocalizationProvider>

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

