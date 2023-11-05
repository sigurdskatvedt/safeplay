import api from "./api";

const AddNewObjection = (objectionData) => {
  // Replace 'your-endpoint' with the actual endpoint for adding a new objection
  const request = api.post('objections/create/', objectionData);
  return request.then((response) => response.data)
    .catch((error) => {
      console.error("Error adding new objection:", error);
      throw error;
    });
};

const ObjectionsService = {
  AddNewObjection, // Add other objection-related functions as needed
};

export default ObjectionsService;

