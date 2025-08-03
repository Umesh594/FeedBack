import axios from "axios";

const BASE_URL = "https://feedback-ekwt.onrender.com/api"; // Replace with your deployed URL when needed

export const api = {
  // AUTH
  register: (name, email, password, adminCode) =>
  axios.post(`${BASE_URL}/auth/register`, { name, email, password, adminCode })
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("user_token", token);
      return res.data;
    }),


  login: (email, password) =>
    axios
      .post(`${BASE_URL}/auth/login`, { email, password })
      .then((res) => {
        const { token } = res.data;
        localStorage.setItem("user_token", token);
        return res.data;
      }),

  logout: () => {
    localStorage.removeItem("user_token");
  },

  isAuthenticated: () => !!localStorage.getItem("user_token"),

  getCurrentUser: () => {
    const token = localStorage.getItem("user_token");
    if (!token) return null;
    return { token };
  },

  // FORMS
  createForm: (formData) =>
    axios
      .post(`${BASE_URL}/forms`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res) => res.data),

  getForms: () =>
    axios.get(`${BASE_URL}/forms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res) => res.data),

  getFormById: (formId) =>
    axios.get(`${BASE_URL}/forms/${formId}`).then((res) => res.data),

  // RESPONSES
  submitResponse: (formId, answers) => 
  axios.post(`${BASE_URL}/responses`, {
    formId,
    answers
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.data),

  getSummary: (formId) =>
    axios
      .get(`${BASE_URL}/responses/summary/${formId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      })
      .then((res) => res.data),

  exportCSV: (formId) =>
    axios
      .get(`${BASE_URL}/responses/export/${formId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        responseType: "blob",
      })
      .then((res) => res.data),

deleteForm: (formId) =>
  axios.delete(`${BASE_URL}/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
  }).then(res => res.data),

getFormResponses: (formId, params = {}) =>
  axios.get(`${BASE_URL}/responses/form/${formId}`, {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
  }).then(res => res.data),
};
