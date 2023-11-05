// frontend/src/components/PrivacyNotice.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import FieldsService from '../services/fields';

const PrivacyNotice = () => {
  const [fieldsInUse, setFieldsInUse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    FieldsService.FetchFieldsInUse()
      .then(data => {
        setFieldsInUse(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not fetch fields in use.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Fields Currently in Use
          </Typography>
          {fieldsInUse.length > 0 ? (
            fieldsInUse.map((field, index) => (
              <Card key={index}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Field Name: {field.field_name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Field ID: {field.field_id}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" component="p">
              No fields are currently in use.
            </Typography>
          )}
        </CardContent>
      </Card>
      {/* Additional cards for other privacy concerns can be added here */}
    </div>
  );
};

export default PrivacyNotice;

