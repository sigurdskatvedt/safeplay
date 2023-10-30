import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import ConsentRequestsService from "../services/consentRequests";

const ConsentRequestCard = ({ consentRequest, update, OpenSnackbar, user }) => {

  const approveConsentRequest = (id) => {
    ConsentRequestsService.approveRequest(id)
      .then((response) => {
        update();
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
      }}
    >
      <CardContent>
        <Typography variant='h4' component='div'>
          Consent Request for {consentRequest.map_name}
        </Typography>

        <Typography variant='h6'>User: {consentRequest.user}</Typography>

        {consentRequest.is_approved ? (
          <Typography variant='h6' color='success'>
            Approved
          </Typography>
        ) : (
          <Typography variant='h6' color='error'>
            Not Approved
          </Typography>
        )}

        <div>{consentRequest.description}</div>
      </CardContent>
      <Stack alignItems='center'>
        <CardActions>
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
      </Stack>
    </Card>
  );
};

export default ConsentRequestCard;

