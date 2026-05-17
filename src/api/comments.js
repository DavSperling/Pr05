import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listCommentsByPost = (postId) => apiGet(`/comments?postId=${postId}`);
export const createComment = (comment) => apiPost("/comments", comment);
export const updateComment = (id, patch) => apiPatch(`/comments/${id}`, patch);
export const deleteComment = (id) => apiDelete(`/comments/${id}`);
