import React from "react";
import TransverseApp from "./componets/appPages/tvApp.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./componets/publicPages/publicRouter.jsx";
import AuthProvider from "./hooks/auth.jsx";
import ProtectedRoute from "./componets/appPages/protectedRoute.jsx";

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
