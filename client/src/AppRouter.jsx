import React from "react";
import TransverseApp from "./components/appPages/tvApp.jsx";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./components/publicPages/publicRouter.jsx";
import ProtectedRoute from "./components/appPages/protectedRoute.jsx";
import "./index.css";
import { useAuth } from "./hooks/userHooks/auth.jsx";
import UserPrefProvider from "./hooks/userHooks/userPreff.jsx";
import { Navigate } from "react-router-dom";
import AdminApp from "./components/adminPages/AdminApp.jsx";

function TransverseAppWithUserPref() {
  const { session, userType } = useAuth();

  //if (userType === "Admin") return <Navigate to={"/admin"} />;

  return (
    <UserPrefProvider session={session}>
      <TransverseApp />
    </UserPrefProvider>
  );
}

function AppRouter() {
  const { session } = useAuth();
  return (
    <Routes>
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <TransverseAppWithUserPref />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminApp />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRouter;
