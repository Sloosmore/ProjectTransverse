import React from "react";
import TransverseApp from "./components/appPages/tvApp.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./components/publicPages/publicRouter.jsx";
import ProtectedRoute from "./components/appPages/protectedRoute.jsx";
import "./index.css";
import { useAuth } from "./hooks/auth.jsx";
import UserPrefProvider from "./hooks/userPreff.jsx";

function TransverseAppWithUserPref({ session }) {
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
            <TransverseAppWithUserPref session={session} />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRouter;
