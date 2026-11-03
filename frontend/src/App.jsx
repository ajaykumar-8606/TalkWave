import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "../components/signup";
import Login from "../components/login";
import Home from "../components/Home";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";

function MainContent() {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            boxShadow: "0 10px 30px -5px rgba(10, 34, 120, 0.2)",
            fontSize: "13px",
            fontWeight: "500",
            padding: "12px 18px",
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={
            authUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login onSwitchToSignup={() => navigate("/signup")} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authUser ? (
              <Navigate to="/" replace />
            ) : (
              <Signup onSwitchToLogin={() => navigate("/login")} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <MainContent />
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
