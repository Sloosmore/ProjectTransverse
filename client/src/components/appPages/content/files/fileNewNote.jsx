import { createFolder } from "@/api/crud/folder/createFolder";
import { useAuth } from "@/hooks/userHooks/auth";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNoteData } from "@/hooks/noteHooks/noteDataStore";
import { newNote } from "../../services/noteWebsockets/noteModeApi";

function FileNewNote({ setNewNoteField, newNoteField }) {
  const navigate = useNavigate();
  const { session } = useAuth();

  const newFolder = async () => {
    const response = await createFolder(session);
    const folderId = response.folder_id;
    navigate(`/app/f/${folderId}`);
  };
  const { setNoteID } = useNoteData();

  const actionMenu = [
    {
      onClick: () => newFolder(),
      iconClass: "bi bi-folder-plus",
      iconSize: "1.25rem",
      text: "Add Folder",
    },
    {
      onClick: () => {},
      iconClass: "bi bi-youtube",
      iconSize: "1.25rem",
      text: "Video (Soon)",
    },
  ];

  return (
    <div className="z-10 ">
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 shadow-sm flex  dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="  rounded-l-lg justify-between px-3 dark:hover:bg-gray-800 text-sm font-semibold text-gray-500 ring-inset ring-gray-300 dark:ring-gray-700 py-auto">
              <i
                className="bi bi-chevron-down"
                style={{ fontSize: ".8rem" }}
              ></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-md text-sm font-semibold text-gray-500 p-0">
            {actionMenu.map((item, index) => (
              <DropdownMenuItem key={index} className="p-0">
                <button
                  onClick={item.onClick}
                  className="flex flex-row content-between hover:bg-gray-200 dark:hover:bg-gray-800 flex-grow px-3 py-2"
                >
                  <i
                    className={item.iconClass}
                    style={{ fontSize: item.iconSize }}
                  ></i>
                  <span className="ms-4 flex w-full">{item.text}</span>
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => {
            //setNewNoteField(!newNoteField)
            newNote(session, setNoteID, navigate);
          }}
          className=" inline-flex rounded-r-lg justify-between px-3 py-2.5 border-gray-300 text-sm font-semibold text-gray-500 dark:bg-gray-900 dark:border-gray-700  hover:bg-gray-200 dark:hover:bg-gray-800 border-s"
        >
          <i className="bi bi-plus-lg" style={{ fontSize: "1.5rem" }}></i>
          <span className="ms-2 flex justify-center items-center w-full text-center my-auto">
            New Note
          </span>
        </button>
      </div>
    </div>
  );
}

export default FileNewNote;
