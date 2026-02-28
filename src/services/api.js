// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// All API calls go through here. Import this instead of using localStorage.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

// Keep a single source of truth for the logged-in user,
// but also mirror to legacy "loggedInUser" key so older code keeps working.
export const getUser = () => {
  const raw = localStorage.getItem("user") || localStorage.getItem("loggedInUser");
  return raw ? JSON.parse(raw) : null;
};

export const setUser = (user) => {
  const serialized = JSON.stringify(user);
  localStorage.setItem("user", serialized);
  localStorage.setItem("loggedInUser", serialized);
};

export const removeUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("loggedInUser");
};

// ── Base fetch wrapper ────────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data     = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (userData) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),

  login: (credentials) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),

  getMe: () => request("/auth/me"),
};

// ── Elections API ─────────────────────────────────────────────────────────────
export const electionsAPI = {
  getAll: () => request("/elections"),

  getById: (id) => request(`/elections/${id}`),

  create: (data) =>
    request("/elections", { method: "POST", body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/elections/${id}`, { method: "DELETE" }),

  addCandidate: (electionId, candidateData) =>
    request(`/elections/${electionId}/candidates`, {
      method: "POST",
      body: JSON.stringify(candidateData),
    }),

  deleteCandidate: (electionId, candidateId) =>
    request(`/elections/${electionId}/candidates/${candidateId}`, { method: "DELETE" }),

  publishResults: (electionId, publish = true) =>
    request(`/elections/${electionId}/publish`, {
      method: "PATCH",
      body: JSON.stringify({ publish }),
    }),
};

// ── Votes API ─────────────────────────────────────────────────────────────────
export const votesAPI = {
  cast: (electionId, candidateName) =>
    request("/votes", {
      method: "POST",
      body: JSON.stringify({ electionId, candidateName }),
    }),

  getMyVotes: () => request("/votes/my"),

  checkVote: (electionId) => request(`/votes/check/${electionId}`),

  getElectionVotes: (electionId) => request(`/votes/election/${electionId}`),
};

// ── Users API ─────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => request("/users"),

  updateProfile: (profileData) =>
    request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwords) =>
    request("/users/change-password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    }),
};