import React from "react";
import { Routes, Route } from "react-router-dom";

//this will apply tailwind which is not what we want
//import styles from "./public.module.css";
import Landing from "./landing/landing";
import Login from "./login";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" />
      <Route path="/terms" />
      <Route path="/policy" />
    </Routes>
  );
}

export default PublicRoutes;
