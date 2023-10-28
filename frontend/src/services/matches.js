import api from "./api";

const GetMatches = () => {
  const request = api.get("/matches/");
  return request.then((response) => response.data);
};

// const GetMatchConsentRequests = (matchId) => {
//   const request = api.get(`/api/matches/${matchId}/consent-requests/`);
//   return request.then((response) => response.data);
// };

const MatchesService = {
  GetMatches,
};

export default MatchesService;
