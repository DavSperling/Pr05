import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listTodosByUser = (userId) => apiGet(`/todos?userId=${userId}`);
export const createTodo = (todo) => apiPost("/todos", todo);
export const updateTodo = (id, patch) => apiPatch(`/todos/${id}`, patch);
export const deleteTodo = (id) => apiDelete(`/todos/${id}`);
