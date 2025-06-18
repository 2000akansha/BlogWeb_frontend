import React from "react";
import { Navigate } from "react-router-dom";

// Mock authentication function (replace with your actual logic)
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null; // Example: Check token
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};
