import { Container, Grid, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useState, useEffect } from "react";
import ConsentRequestsService from "../services/consentRequests";
import Request from "./Request"; // You might want to rename this component to ConsentRequest or similar

const ConsentRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const OpenSnackbar = (text) => {
    setSnackbarText(text);
    setSnackbarOpen(true);
  };

  const Update = () => {
    ConsentRequestsService.fetchAllRequests() // Assuming you have this method in the service
      .then((response) => {
        setRequests(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    Update();
  }, []);

  return (
    <Container>
      <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h2'>
        Consent Requests
      </Typography>

      {user === null ? (
        <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h4'>
          Please log in to see consent requests
        </Typography>
      ) : (
        <>
          <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h4'>
            Pending Requests
          </Typography>

          <Grid container padding={2} spacing={5} justifyContent='center'>
            {requests.map((r) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={r.id}>
                <Request
                  user={user}
                  consentRequest={r}
                  update={Update}
                  OpenSnackbar={OpenSnackbar}
                />
              </Grid>
            ))}
          </Grid>

          <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h4'>
            Request History
          </Typography>

          {/* Request history will be added here later */}
        </>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: "100%" }}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ConsentRequests;

