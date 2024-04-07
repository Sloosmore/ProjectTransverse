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
import { BrowserProvider } from "./hooks/browserSupport.jsx";
import { Toaster } from "@/components/ui/sonner";
import { CodeProvider } from "./hooks/code.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <BrowserProvider>
          <AuthProvider>
            <CodeProvider>
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
            </CodeProvider>
          </AuthProvider>
          <Toaster />
        </BrowserProvider>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
