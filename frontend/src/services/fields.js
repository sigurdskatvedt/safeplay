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

const FieldsService = {
  FetchAvailableTimeSlots,
};

export default FieldsService;
