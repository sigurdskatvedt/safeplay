import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import React from "react";
import ConsentRequestsService from "../services/consentRequests";

const ConsentRequestCard = ({ consentRequest, update, OpenSnackbar }) => {

  const approveConsentRequest = (id) => {
    ConsentRequestsService.approveRequest(id)
      .then((response) => {
        update();
        console.log(consentRequest);
        OpenSnackbar("Consent request approved");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeApproval = (id) => {
    ConsentRequestsService.removeApproval(id)
      .then((response) => {
        update();
        OpenSnackbar("Approval removed");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      sx={{
        position: "relative",
        maxHeight: 400,
        minHeight: 200,
        width: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant='h5' component='div' gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {consentRequest.match.team1.name} vs {consentRequest.match.team2.name}
        </Typography>

        <Typography variant='body2' color="text.secondary" gutterBottom>
          {new Date(consentRequest.match.date_time).toLocaleDateString()} at {new Date(consentRequest.match.date_time).toLocaleTimeString()}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant='body2' color="text.secondary" gutterBottom>
          Player: {consentRequest.user.first_name} {consentRequest.user.last_name}
        </Typography>

        {consentRequest.is_approved ? (
          <Typography variant='body2' color='success.main' sx={{ mt: 1 }}>
            Approved
          </Typography>
        ) : (
          <Typography variant='body2' color='error.main' sx={{ mt: 1 }}>
            Not Approved
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        {!consentRequest.is_approved && (
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={() => approveConsentRequest(consentRequest.id)}
          >
            Approve
          </Button>
        )}
        {consentRequest.is_approved && (
          <Button
            size='small'
            variant='contained'
            color='secondary'
            onClick={() => removeApproval(consentRequest.id)}
          >
            Remove Approval
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ConsentRequestCard;

