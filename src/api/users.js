import { apiGet, apiPost, apiPatch } from "./client.js";

export const findUserByUsername = async (username) => {
  const matches = await apiGet(`/users?username=${encodeURIComponent(username)}`);
  return matches[0] ?? null;
};

export const getUser = (id) => apiGet(`/users/${id}`);
export const createUser = (user) => apiPost("/users", user);
export const updateUser = (id, patch) => apiPatch(`/users/${id}`, patch);
