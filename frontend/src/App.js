// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context";
import BottomNav from "./components/BottomNav";
import LoginPage from "./pages/LoginPage";
import TimeLogForm from "./pages/TimeLogForm";
import TimeLogHistory from "./pages/TimeLogHistory";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ConfigProvider } from "antd-mobile";
import viVN from "antd-mobile/es/locales/vi-VN"; // hoặc "antd-mobile/cjs/locales/vi-VN"
import enUS from "antd-mobile/es/locales/en-US"; // hoặc "antd-mobile/cjs/locales/en-US"
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider locale={enUS}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><TimeLogForm /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><TimeLogHistory /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BottomNav />
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
