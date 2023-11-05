import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Divider,
  Switch,
  Stack,
} from "@mui/material";
import React from "react";
import ConsentRequestsService from "../services/consentRequests";

const ConsentRequestCard = ({ consentRequest, update, OpenSnackbar }) => {

  const handleApprovalChange = (event) => {
    const newApprovalStatus = event.target.checked;
    if (newApprovalStatus) {
      approveConsentRequest(consentRequest.id);
    } else {
      removeApproval(consentRequest.id);
    }
  };


  const approveConsentRequest = (id) => {
    ConsentRequestsService.approveRequest(id)
      .then((response) => {
        update();
        console.log(consentRequest);
        OpenSnackbar("Consent request approved", "success");
      })
      .catch((error) => {
        if (error.response.status === 403) {
          const errorCode = error.response.data.error_code;
          if (errorCode === 'not_guardian') {
            OpenSnackbar("Only guardian can approve this request.", "error");
          } else {
            OpenSnackbar("You do not have permission to approve this request.", "error");
          }
        } else {
          console.log(error);
        }
      });
  };

  const removeApproval = (id) => {
    ConsentRequestsService.removeApproval(id)
      .then((response) => {
        update();
        OpenSnackbar("Approval removed", "success");
      })
      .catch((error) => {
        if (error.response.status === 403) {
          const errorCode = error.response.data.error_code;
          if (errorCode === 'not_guardian') {
            OpenSnackbar("Only guardian can approve this request.", "error");
          } else {
            OpenSnackbar("You do not have permission to remove approval for this request.", "error");
          }
        } else {
          console.log(error);
        }
      });
  };

  return (
    <Card
      sx={{
        position: 'relative',
        maxHeight: 400,
        minHeight: 200,
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant='body2' color={consentRequest.request_status === "accepted" ? 'success.main' : 'error.main'} sx={{ mt: 1 }}>
            {consentRequest.request_status === "accepted" ? 'Accepted' : 'Not Approved'}
          </Typography>
          <Switch
            checked={consentRequest.is_approved}
            onChange={handleApprovalChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ConsentRequestCard;

