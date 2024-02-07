import React from "react";
import ReactMarkdown from "react-markdown";
import Modal from "react-bootstrap/Modal";

function HelpModal({ show, onClose }) {
  if (!show) {
    return null;
  }
  const title = `## Take Notes. Make Docs. In real time. Your way.`;
  const content = `
  ## Note Personilzation\n 
  - Voice: Say the title of your notes and then afterword say 'note insturctions'\n
  - Command Center: Open the Command Center and enter in custom LLM propmpt\n
  ##\n
  ## Note Taking\n
  - Voice: Say the title of your notes and then "Note Mode" afterword to be\n
  - Command Center: Open the Command Center, navigate to the 2nd accordian tab, enter document name and submit\n
  ##\n
  ## Document Gen\n
  - Voice: give your document a prompt and then say the keyword "tranverse" after a brief pause to send your script to the backend\n
  - Command Center: Open the Command Center and enter in custom LLM propmpt\n
  ##\n
  ## Clear Transcript\n
   - Voice: say "Clear" after pausing breifly while to the model\n
   - Keyboard: Press the C Key\n

   ## Additional Commands\n
   - "Help": Brings up this modal
   `;

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      className="text-secondary"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <ReactMarkdown>{title}</ReactMarkdown>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactMarkdown>{content}</ReactMarkdown>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default HelpModal;

/*           <div className="modal-header">
            <h5 className="modal-title">How to use Transverse</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>*/
