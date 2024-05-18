import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/theme";
import { useAuth } from "@/hooks/userHooks/auth";

function ChangeFolder({ open, folderId, setSelectedValue, folders }) {
  const { darkMode } = useTheme(); // Get the darkMode state

  const { session } = useAuth();
  const [activeFolder, setActiveFolder] = useState("Choose a folder");

  useEffect(() => {
    console.log(folderId);
    console.log(folders);
    if (folderId) {
      setActiveFolder(folders.find((folder) => folder.folder_id === folderId));
    }
  }, [folders, folderId, open]);

  useEffect(() => {
    console.log("activeFolder", activeFolder);
    setSelectedValue(activeFolder?.folder_id || null);
  }, [activeFolder]);

  return (
    <div className=" h-[52px] flex items-center me-2 ">
      <Select
        className="self-center"
        defaultValue={
          folderId
            ? folders.find((folder) => folder.folder_id === folderId).folder_id
            : "No folder"
        }
        onValueChange={(value) => {
          setSelectedValue(value);
        }}
      >
        <SelectTrigger className="w-[100px] p-0 md:p-3 sm:w-[180px] ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {folders.map((folder, index) => (
            <SelectItem key={index} value={folder.folder_id}>
              {folder.title}
            </SelectItem>
          ))}
          <Separator className="my-2" />
          <SelectItem value={"No folder"}>No Folder</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default ChangeFolder;
