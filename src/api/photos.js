import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listPhotosByAlbum = (albumId, page, limit) =>
  apiGet(`/photos?albumId=${albumId}&_page=${page}&_limit=${limit}`);
export const listAllPhotosByAlbum = (albumId) =>
  apiGet(`/photos?albumId=${albumId}`);
export const createPhoto = (photo) => apiPost("/photos", photo);
export const updatePhoto = (id, patch) => apiPatch(`/photos/${id}`, patch);
export const deletePhoto = (id) => apiDelete(`/photos/${id}`);
