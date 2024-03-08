import React from "react";
import TransverseApp from "./components/appPages/tvApp.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./components/publicPages/publicRouter.jsx";
import AuthProvider from "./hooks/auth.jsx";
import ProtectedRoute from "./components/appPages/protectedRoute.jsx";
import "./index.css";
//import "bootstrap/dist/css/bootstrap.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/app/*"
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
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
