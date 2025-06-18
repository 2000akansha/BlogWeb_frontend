import axios from "axios";
import CryptoJS from "crypto-js";
import { INTEGRITY_SECRET_KEY } from "../../config";
// const SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;
// console.log("SECRET_KEY:",SECRET_KEY);
const formDataToString = (formData) => {
  const sortedEntries = [...formData.entries()]
    .map(([key, value]) => {
      if (value instanceof File) {
        return `${key}=${value.name}`; // Use file name for consistency
      }
      return `${key}=${value}`;
    })
    .sort((a, b) => a.localeCompare(b)) // Sort for consistency
    .join('&');
  return sortedEntries;
};
// Apply global interceptor to modify headers for every request
axios.interceptors.request.use(
  async (config) => {
    let payloadString;
    if (config.data instanceof FormData) {
      // Convert FormData to a consistent string
      payloadString = formDataToString(config.data);
    } else {
      // Convert JSON data to string
      payloadString = JSON.stringify(config.data);
    }
    // In case the payload is empty, we use an empty string (""),
    if (!payloadString) {
      payloadString = ''; // Make sure payloadString is empty for empty bodies
    }
    // Generate HMAC hash
    const hash = CryptoJS.HmacSHA256(payloadString, INTEGRITY_SECRET_KEY).toString();
    // Set headers for integrity verification
    config.headers['X-Signature'] = hash;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);