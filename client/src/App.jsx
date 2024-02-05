import React from "react";
import ReactDOM from "react-dom/client";
import TransverseApp from "./appPages/tvApp.jsx";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./publicPages/publicRouter.jsx";

function App() {
  return (
    <Routes>
      <Route path="/n/*" element={<TransverseApp />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default App;
