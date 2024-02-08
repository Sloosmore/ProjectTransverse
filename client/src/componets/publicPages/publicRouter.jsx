import React from "react";
import { Routes, Route } from "react-router-dom";

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
      <Route path="/about" />
      <Route path="/terms" />
      <Route path="/policy" />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default PublicRoutes;
