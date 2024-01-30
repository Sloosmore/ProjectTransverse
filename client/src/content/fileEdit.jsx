import React from "react";
import { Offcanvas } from "react-bootstrap";
import { useState } from "react";

import { updateTitle, updateVis, deleteRecord } from "../services/crudApi";

function EditOffcanvas({ show, handleClose, file }) {
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: "100vh" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit Note</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Add your form or other content here */}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default EditOffcanvas;
