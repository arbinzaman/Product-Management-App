import axios from 'axios';

export const api = (token) =>
  axios.create({
    baseURL: 'https://api.bitechx.com',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
