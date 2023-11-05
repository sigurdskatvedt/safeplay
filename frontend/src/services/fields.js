import api from "./api";

const FetchAvailableTimeSlots = (fieldId, date, timezone) => {
  const formattedDate = JSON.stringify(date).replace(/"/g, '');
  console.log(formattedDate);
  const request = api.get(`fields/field-bookings/${fieldId}/`, {
    params: {
      date: formattedDate,
      timezone, // include user's timezone
    },
  });
  return request.then((response) => response.data);
};

const FetchFieldsInUse = () => {
  return api.get('fields/current-use/')
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching fields in use:", error);
      throw error;
    });
};

const FieldsService = {
  FetchAvailableTimeSlots,
  FetchFieldsInUse, // Add the new function to the exported service object
};

export default FieldsService;
