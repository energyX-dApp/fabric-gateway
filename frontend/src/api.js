import axios from "axios";

export const API_BASE_URL = "https://energyx_api.guywithxm5.in";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function authHeaders() {
  const token = localStorage.getItem("token");
  const orgKey = localStorage.getItem("orgKey"); // Org1 | Org2 | Gov
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (orgKey) headers["x-org"] = orgKey;
  return headers;
}


