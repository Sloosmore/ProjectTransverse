import React from "react";
import TransverseApp from "./components/appPages/tvApp.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./components/publicPages/publicRouter.jsx";
import AuthProvider from "./hooks/userHooks/auth.jsx";
import ProtectedRoute from "./components/appPages/protectedRoute.jsx";
import "./index.css";
//import "bootstrap/dist/css/bootstrap.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserProvider } from "./hooks/browserSupport.jsx";
import { Toaster } from "@/components/ui/sonner";
import FacebookPixel from "./lib/FacebookPixle.jsx";
import GoogleAnalytics from "./lib/googleAnalytics.jsx";
import AppRouter from "./AppRouter.jsx";
import ThemeProvider from "./hooks/theme.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <BrowserProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </BrowserProvider>
      </BrowserRouter>
      <GoogleAnalytics />
      <FacebookPixel />
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
