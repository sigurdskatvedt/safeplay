import api from "./api";

const fetchPendingRequests = () => {
  return api.get("/consent-requests/").then((response) => response.data);
};

const fetchPastRequests = () => {
    return api.get("past-requests/").then((response) => response.data);
};

const approveRequest = (requestId) => {
  return api.post(`/approve/`, requestId).then((response) => response.data);
};

const removeApproval = (requestId) => {
  return api.post(`/remove-approval/`, requestId).then((response) => response.data);
};

const ConsentRequestsService = {
  approveRequest,
  removeApproval,
  fetchPendingRequests,
  fetchPastRequests,
};

export default ConsentRequestsService;


