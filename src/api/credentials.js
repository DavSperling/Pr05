import { apiGet, apiPost, apiPatch } from "./client.js";

export const findCredentialByUserId = async (userId) => {
  const matches = await apiGet(`/credentials?userId=${userId}`);
  return matches[0] ?? null;
};

export const createCredential = (credential) => apiPost("/credentials", credential);
export const updateCredential = (id, patch) => apiPatch(`/credentials/${id}`, patch);
