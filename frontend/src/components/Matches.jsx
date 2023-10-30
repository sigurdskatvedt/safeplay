import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MatchesService from "../services/matches"; // Import the MatchesService

const Matches = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [finishedMatches, setFinishedMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const matchesData = await MatchesService.GetMatches();
      console.log(matchesData); // Log the fetched matches data
      // Process and set the matches data to state as per your requirements
      const upcomingMatchesData = matchesData.filter(
        (match) => match.date_time > new Date().toISOString()
      );
      const finishedMatchesData = matchesData.filter(
        (match) => match.date_time <= new Date().toISOString()
      );

      const upcomingMatches = upcomingMatchesData.map((match) => ({
        id: match.id,
        teams: `${match.team1.name} vs ${match.team2.name}`,
        date: match.date_time,
        // pending: 0, // You need to add logic to calculate the number of pending requests
        accepted: 0, // You need to add logic to calculate the number of accepted requests
        declined: 0, // You need to add logic to calculate the number of declined requests
      }));

      const finishedMatches = finishedMatchesData.map((match) => ({
        id: match.id,
        teams: `${match.team1.name} vs ${match.team2.name}`,
        date: match.date_time,
        // pending: 0, // You need to add logic to calculate the number of pending requests
        accepted: 0, // You need to add logic to calculate the number of accepted requests
        declined: 0, // You need to add logic to calculate the number of declined requests
        // withdrawn: 0, // You need to add logic to calculate the number of withdrawn requests
        status: "Not approved", // You need to add logic to calculate the status
      }));

      setUpcomingMatches(upcomingMatches);
      setFinishedMatches(finishedMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography sx={{ textAlign: "center", marginTop: 3 }} variant="h2">
        Matches Overview
      </Typography>

      <Typography variant="h5" style={{ marginTop: 20 }}>
        Upcoming Matches
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Teams Involved</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Pending</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Accepted</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Declined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.teams}</TableCell>
                <TableCell>{match.date}</TableCell>
                {/* <TableCell>{match.pending}</TableCell> */}
                <TableCell>{match.accepted}</TableCell>
                <TableCell>{match.declined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" style={{ marginTop: 20 }}>
        Finished Matches
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Teams Involved</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Pending</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Accepted</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Declined</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Withdrawn</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finishedMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.teams}</TableCell>
                <TableCell>{match.date}</TableCell>
                {/* <TableCell>{match.pending}</TableCell> */}
                <TableCell>{match.accepted}</TableCell>
                <TableCell>{match.declined}</TableCell>
                {/* <TableCell>{match.withdrawn}</TableCell> */}
                <TableCell>{match.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Matches;

