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
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
    // Replace this mock data with an API call to get actual matches data
    const mockUpcomingMatches = [
      {
        id: 1,
        teams: "Team A1 vs Team B1",
        date: "2023-11-10",
        pending: 5,
        accepted: 2,
        declined: 0,
      },
      {
        id: 2,
        teams: "Team A2 vs Team B2",
        date: "2023-11-15",
        pending: 3,
        accepted: 1,
        declined: 1,
      },
    ];

    const mockFinishedMatches = [
      {
        id: 3,
        teams: "Team A3 vs Team B3",
        date: "2023-10-01",
        pending: 0,
        accepted: 2,
        declined: 1,
        withdrawn: 1,
        status: "Not approved",
      },
      {
        id: 4,
        teams: "Team A4 vs Team B4",
        date: "2023-10-05",
        pending: 0,
        accepted: 1,
        declined: 2,
        withdrawn: 0,
        status: "OK",
      },
    ];

    setUpcomingMatches(mockUpcomingMatches);
    setFinishedMatches(mockFinishedMatches);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <Container maxWidth='md'>
      <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h2'>
        Matches Overview
      </Typography>

      <Typography variant='h5' style={{ marginTop: 20 }}>
        Upcoming Matches
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Teams Involved</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pending</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Accepted</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Declined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.teams}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.pending}</TableCell>
                <TableCell>{match.accepted}</TableCell>
                <TableCell>{match.declined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>      </TableContainer>

      <Typography variant='h5' style={{ marginTop: 20 }}>
        Finished Matches
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Teams Involved</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pending</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Accepted</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Declined</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Withdrawn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finishedMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.teams}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.pending}</TableCell>
                <TableCell>{match.accepted}</TableCell>
                <TableCell>{match.declined}</TableCell>
                <TableCell>{match.withdrawn}</TableCell>
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

