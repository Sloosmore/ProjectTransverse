import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import PdfView from "./pdfViewer";
import { Button } from "@/components/ui/button";

const Slides = React.memo(function Slides({
  currentNote,
  activeUrl,
  setActiveUrl,
}) {
  const [uploadedFile, setUploadedFile] = useState("");
  const [fileType, setFileType] = useState("");

  const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

  const uploadSlides = async (file, note_id) => {
    if (uploadedFile) {
      if (inDevelopment) {
        console.log("note_id", note_id);
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("note_id", note_id);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/records-api/upload-slides`,
        {
          method: "POST",
          body: formData,
        }
      );
      const { slide_url } = await response.json();
      setActiveUrl(slide_url);
      const newfileType = slide_url.split(".").pop();
      if (inDevelopment) {
        console.log("slide_url", slide_url);
        console.log("File type:", newfileType);
      }
      setFileType(newfileType);
    }
  };

  useEffect(() => {
    if (inDevelopment) {
      console.log("activeUrl", activeUrl);
    }
  }, [activeUrl]);

  return (
    <div className="flex flex-row justify-center h-full">
      {activeUrl ? (
        <div className="w-full">
          <DocViewer
            sandbox="allow-scripts"
            prefetchMethod="GET"
            documents={[
              {
                uri: activeUrl,
              },
            ]}
            renderers={DocViewerRenderers}
          />
        </div>
      ) : (
        <div className="flex-row flex border p-2 rounded-lg self-center w-full sm:mx-10 md:mx-20">
          <input
            type="file"
            placeholder="Slide link here"
            onChange={(e) => setUploadedFile(e.target.files[0])}
            accept="application/pdf, application/vnd.openxmlformats-officedocument.presentationml.presentation"
            className="  file:-mx-3  file:ms-1 file:rounded-sm file:text-gray-600 file:overflow-hidden file:rounded-none file:border-0 file:bg-gray-100 file:hover:bg-gray-200 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out  file:[margin-inline-end:0.75rem] text-gray-700 text-sm focus:outline-none focus:ring-0 focus:border-0 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full grow"
          />
          <Button
            onClick={async () =>
              await uploadSlides(uploadedFile, currentNote.note_id)
            }
            className=" py-1 px-4 my-1"
            variant="secondary"
          >
            Upload
          </Button>
        </div>
      )}
    </div>
  );
});

export default Slides;
