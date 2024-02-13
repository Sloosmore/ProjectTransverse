import React from "react";
import { Toast } from "react-bootstrap";

const SubmitToast = ({ activeToast, toastMessage }) => {
  return (
    <div>
      {activeToast && (
        <Toast
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
          className="bg-success text-white"
        >
          <Toast.Body className="bg-success">
            <i className="bi bi-check2-circle me-2"></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      )}
    </div>
  );
};

export default SubmitToast;
