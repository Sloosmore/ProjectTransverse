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
import WaitlistScreen from "./waitlist/waitlistScreen";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/code" element={<Login />} />
      <Route path="/about" element={<ComingSoon />} />
      <Route path="/privacy" element={<PrivatePolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/policy" element={<ComingSoon />} />
      <Route path="/getin" element={<WaitlistScreen />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default PublicRoutes;

//{<Route path="/code" element={<CodeCheck />} />}
