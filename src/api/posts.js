import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listPostsByUser = (userId) => apiGet(`/posts?userId=${userId}`);
export const listAllPosts = () => apiGet("/posts");
export const getPost = (id) => apiGet(`/posts/${id}`);
export const createPost = (post) => apiPost("/posts", post);
export const updatePost = (id, patch) => apiPatch(`/posts/${id}`, patch);
export const deletePost = (id) => apiDelete(`/posts/${id}`);
