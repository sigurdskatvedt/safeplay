import { Box, Stack, Typography, Snackbar, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import DocumentService from "../services/documents";

const Object = () => {
  const [objectionText, setObjectionText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const OpenSnackbar = (text) => {
    setSnackbarText(text);
    setSnackbarOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd handle the objection submission logic, uploading files, sending the text, etc.
    console.log(objectionText);
    console.log(selectedFile);
  };

  return (
    <>
      <Stack alignItems='center' spacing={1} marginTop={2}>
        <Typography variant='h2'>Submit Your Objections</Typography>

        <Typography variant='h5'>Your Objection:</Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={objectionText}
          onChange={(e) => setObjectionText(e.target.value)}
        />

        <Button variant='contained' component='label'>
          Upload Additional Documents
          <input
            hidden
            type='file'
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </Button>

        <Typography variant='h6'>
          {selectedFile ? selectedFile.name : "No document selected"}
        </Typography>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!objectionText && !selectedFile}
        >
          Submit Objection
        </Button>
      </Stack>

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
    </>
  );
};

export default Object;

