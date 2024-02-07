import React from "react";
import ReactDOM from "react-dom/client";
import TransverseApp from "./componets/appPages/tvApp.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./componets/publicPages/publicRouter.jsx";
import { AuthProvider } from "./hooks/auth.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/n/*" element={<TransverseApp />} />
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
