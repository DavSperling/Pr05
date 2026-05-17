import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listAlbumsByUser = (userId) => apiGet(`/albums?userId=${userId}`);
export const getAlbum = (id) => apiGet(`/albums/${id}`);
export const createAlbum = (album) => apiPost("/albums", album);
export const updateAlbum = (id, patch) => apiPatch(`/albums/${id}`, patch);
export const deleteAlbum = (id) => apiDelete(`/albums/${id}`);
