import React from "react";
import { Routes, Route } from "react-router-dom";
import ComingSoon from "./coming soon/commingSoon";

//this will apply tailwind which is not what we want
//import styles from "./public.module.css";
import Landing from "./landing/landing";
import Login from "./login";
import NotFound from "./notFound/notFound";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<ComingSoon />} />
      <Route path="/terms" element={<ComingSoon />} />
      <Route path="/policy" element={<ComingSoon />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default PublicRoutes;
