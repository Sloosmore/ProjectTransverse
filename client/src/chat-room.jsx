import { useParams, useLocation } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

function Chatroom() {
  const { taskId } = useParams();
  const location = useLocation();
  const { outfile, transcription } = location.state;

  const doc = [{ uri: outfile }];

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="text-secondary text-center">
        <p>Filename: {outfile}</p>

        <p>Prompt: {transcription}</p>
        <hr />
        <div className="text-center">
          <DocViewer documents={doc} pluginRenderers={DocViewerRenderers} />
        </div>
      </div>
    </div>
  );
}

export default Chatroom;
