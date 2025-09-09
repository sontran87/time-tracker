// src/routes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TimeLogForm from "./pages/TimeLogForm";
import TimeLogHistory from "./pages/TimeLogHistory";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><TimeLogForm /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><TimeLogHistory /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
