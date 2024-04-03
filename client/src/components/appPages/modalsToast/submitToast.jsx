import React from "react";
import { Toast } from "react-bootstrap";
import { useToast } from "@/hooks/toast";

const SubmitToast = () => {
  const { activeToast, toastMessage } = useToast();
  return (
    <div>
      {activeToast && (
        <Toast
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
          className="bg-green-300 text-white"
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
