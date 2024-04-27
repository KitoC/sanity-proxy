const axios = require("axios");

const api = axios.create({
  baseURL: `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v${process.env.SANITY_VERSION}`,
  headers: { Authorization: `Bearer ${process.env.SANITY_SECRET_TOKEN}` },
});

module.exports = api;
