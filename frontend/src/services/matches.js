import api from "./api";

const GetMatches = () => {
  const request = api.get("/matches/");
  return request.then((response) => response.data);
};

const AddMatch = (matchData) => {
  const request = api.post("/matches/", matchData);
  return request.then((response) => response.data);
};

const MatchesService = {
  GetMatches,
  AddMatch,
};

export default MatchesService;

