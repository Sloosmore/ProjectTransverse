import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import React from "react";
import { useEffect } from "react";
import EditExportNote from "../fileEditShad";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function FolderScroll({ files, folders, canvasEdit }) {
  useEffect(() => {
    console.log("folders", folders);
    console.log("files", files);
  }, [folders, files]);

  const { setOffCanvasEdit } = canvasEdit;
  //this needs to be in the use effect for use State

  const handleClose = () => setOffCanvasEdit(false);

  const navigate = useNavigate();

  const goToTask = (notes) => {
    navigate(`/app/n/${notes.note_id}`, {
      state: {
        title: notes.title,
        id: notes.note_id,
        markdown: notes.full_markdown,
        status: notes.status,
      },
    });
  };

  return (
    <div
      className="w-full flex-grow border-t overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 145px)" }}
    >
      {folders.map((folder, index) => (
        <div key={index} className=" items-center gap-x-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{folder.title}</AccordionTrigger>
              <AccordionContent>
                <div>
                  <table className="w-full text-gray-600">
                    <tbody>
                      {files
                        .filter((file) => file.folder_id === folder.folder_id)
                        .map((file, index) => (
                          <tr
                            key={index}
                            className={`hover:bg-gray-200 border-b`}
                          >
                            <td
                              className="align-middle py-3 ps-3"
                              onClick={() => goToTask(file)}
                            >
                              {file.title}
                            </td>
                            <td
                              className="align-middle hidden lg:table-cell py-2"
                              onClick={() => goToTask(file)}
                            >
                              {new Date(file.date_created).toLocaleDateString(
                                undefined,
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="">
                              <Sheet>
                                <SheetTrigger className=" border-2 border-gray-300 p-4 w-4 h-5 flex justify-center items-center hover:bg-gray-500 rounded-lg hover:text-white">
                                  <div className="  align-middle  ">
                                    <i className=" bi bi-gear align-middle "></i>
                                  </div>
                                </SheetTrigger>
                                <EditExportNote
                                  canvasEdit={canvasEdit}
                                  handleClose={handleClose}
                                  file={file}
                                />
                              </Sheet>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default FolderScroll;
