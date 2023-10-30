import api from "./api";

const fetchAllRequests = () => {
  return api.get("/user-requests/").then((response) => response.data);
};

const approveRequest = (requestId) => {
  return api.post(`/approve/${requestId}/`).then((response) => response.data);
};

const removeApproval = (requestId) => {
  return api.post(`/remove-approval/${requestId}/`).then((response) => response.data);
};

const ConsentRequestsService = {
  approveRequest,
  removeApproval,
  fetchAllRequests,
};

export default ConsentRequestsService;

