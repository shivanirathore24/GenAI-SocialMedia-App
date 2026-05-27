import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";

import Feed from "../pages/Feed";

import Login from "../pages/Login";

import Signup from "../pages/Signup";

function AppRoutes() {
  return (
    <Routes>
      {/* Home Feed */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      {/* Optional Feed Route */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default AppRoutes;
