import React from "react";
import TransverseApp from "./components/appPages/tvApp.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./components/publicPages/publicRouter.jsx";
import AuthProvider from "./hooks/auth.jsx";
import ProtectedRoute from "./components/appPages/protectedRoute.jsx";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/n/*"
            element={
              <ProtectedRoute>
                <TransverseApp />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
