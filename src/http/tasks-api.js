import api from "./api";

const resource = "/tasks";

export const allTasks = () => api.get(resource);

export const createTasks = (tasks) => api.post(resource, tasks);

export const updateTasks = (id, task) => api.put(`${resource}/${id}`, task);

export const removeTasks = (id) => api.delete(`${resource}/${id}`);

export const completeTask = (id, task) =>
  api.patch(`${resource}/${id}/complete`, task);
