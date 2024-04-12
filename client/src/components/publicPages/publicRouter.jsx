import React from "react";
import { Routes, Route } from "react-router-dom";
import ComingSoon from "./coming soon/commingSoon";

//this will apply tailwind which is not what we want
//import styles from "./public.module.css";
import Landing from "./landing/landing";
import Login from "./login/login";
import NotFound from "./notFound/notFound";
import PrivatePolicy from "./policies/private";
import TermsOfService from "./policies/terms";
import ProtectedCodeRoute from "./login/codeProtect";
import CodeCheck from "./passcode/codePage";
import WaitlistScreen from "./waitlist/waitlistScreen";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <ProtectedCodeRoute>
            <Login />
          </ProtectedCodeRoute>
        }
      />
      <Route path="/about" element={<ComingSoon />} />
      <Route path="/privacy" element={<PrivatePolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/policy" element={<ComingSoon />} />
      <Route path="/code" element={<CodeCheck />} />
      <Route path="/getin" element={<WaitlistScreen />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default PublicRoutes;
