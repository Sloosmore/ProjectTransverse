import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteFolder } from "@/components/appPages/services/crudApi";
import FileScroll from "./fileScroll";
import EditExportNote from "../fileEditShad";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp } from "lucide-react";
import { useWindowWidth } from "@/hooks/windowWidth";
import { Input } from "@/components/ui/input";

function FolderBox({ folders, files, handleDeleteFolder }) {
  const windowWidth = useWindowWidth();
  //this needs to be in the use effect for use State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [sortField, setSortField] = useState(null);

  if (searchTerm !== "") {
    folders = folders.filter((folders) =>
      folders.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  const [folderDialog, setFolderDialog] = useState(false);

  const navigate = useNavigate();

  let sortedFiles = [...files.filter((folder) => !folder.folder_id)];
  let sortedFolders = [...folders];

  if (searchTerm !== "") {
    sortedFiles = sortedFiles.filter((file) =>
      file.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const [sortDirection, setSortDirection] = useState(true);

  const handleSort = (field) => {
    let direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  if (sortField !== null) {
    sortedFiles.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Convert to Date objects if the values are dates
      if (sortField === "date_updated") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Convert to lowercase if the values are strings
      else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      return 0;
    });
  }

  if (sortValue !== null) {
    sortedFolders.sort((a, b) => {
      let aValue = a[sortValue];
      let bValue = b[sortValue];

      // Convert to Date objects if the values are dates

      // Convert to lowercase if the values are strings
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === true ? 1 : -1;
      }
      if (aValue > bValue) {
        return sortDirection === false ? -1 : 1;
      }
      return 0;
    });
  }

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
    <div className="h-full  flex flex-col">
      <div className="w-full sm:flex-row flex-col flex justify-between mt-1">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="lg:w-1/3 md:w-5/12 w-7/12 py-2 px-3 rounded-md shrink shadow-sm ms-1"
        />
        <div className="flex sm:flex-row flex-row-reverse items-center mt-4 sm:mt-0 align-start sm:me-0 me-auto ">
          {sortField && (
            <button
              className="md:me-1 p-2 rounded ms-2"
              onClick={() => {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}
            >
              <ArrowDownUp className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <Select onValueChange={(value) => handleSort(value)}>
            <SelectTrigger className="w-[180px] ring-0 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date_updated" className="">
                  Date
                </SelectItem>
                <SelectItem value="title" className="">
                  Title
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="max-h-[350px] pb-8 overflow-hidden pt-6 flex-none">
        <div className="w-full flex-grow flex flex-row grid xl:grid-cols-3 md:grid-cols-2 md:gap-x-16 gap-x-8 gap-y-6">
          {sortedFolders.map((folder, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-900 rounded-[2rem] "
              onClick={() => {
                if (folderDialog === false) {
                  navigate(`/app/f/${folder.folder_id}`);
                }
              }}
            >
              <div className="flex flex-col w-full h-36 border rounded-[2rem] transform transition-transform duration-500 hover:-translate-y-1 bg-white dark:bg-[#020817]">
                <div className="ps-8 pt-8 text-gray-700 dark:text-gray-200">
                  <h2 className="md:w-full overflow-hidden md:overflow-hidden md:whitespace-nowrap overflow-ellipsis pe-8">
                    {(windowWidth < 750 &&
                      folder.title.slice(0, 15) +
                        (folder.title.length > 15 ? "..." : "")) ||
                      folder.title}
                  </h2>
                  <h4>
                    Created:{" "}
                    {new Date(folder.created_at).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h4>
                </div>
                <div className="flex justify-end me-1">
                  <Dialog
                    onOpenChange={() => {
                      if (!folderDialog) {
                        setFolderDialog(true);
                      } else {
                        setTimeout(() => setFolderDialog(false), 100);
                      }
                    }}
                  >
                    <div
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                    >
                      <DialogTrigger className="p-2 me-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 ">
                        <div className="w-6 h-6">
                          <i className="bi bi-three-dots"></i>
                        </div>
                      </DialogTrigger>
                    </div>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Folder?</DialogTitle>
                        <div className="flex justify-center">
                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                className=" mt-5"
                                onClick={() => {
                                  handleDeleteFolder(folder.folder_id);
                                }}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow border-t-2 overflow-auto ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[500px]">Title</TableHead>
              <TableHead className="sm:w-[8rem] text-center flex items-center">
                Date
              </TableHead>
              <TableHead className=" w-10">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFiles.map((file, index) => (
              <TableRow key={index}>
                <TableCell
                  className="align-middle py-3 ps-3 text-base"
                  onClick={() => goToTask(file)}
                >
                  {file.title}
                </TableCell>
                <TableCell onClick={() => goToTask(file)}>
                  {new Date(file.date_updated).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="">
                  <div className="ms-auto">
                    <EditExportNote file={file} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!files.length && (
          <div className="text-center py-3 md:mx-10 mx-3 text-3xl font-semibold">
            No notes to see here yet! But click the bottom right quesiton mark
            to get started
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderBox;

{
  /*

                
                
                
                
              <table className="w-full text-gray-600">
          <tbody>
            {sortedFiles.map((file, index) => (
              <tr key={index} className={`hover:bg-gray-200 border-b`}>
                <td
                  className="align-middle py-3 ps-3"
                  onClick={() => goToTask(file)}
                >
                  {file.title}
                </td>
                <td
                  className="align-middle py-3 pe-6"
                  onClick={() => goToTask(file)}
                >
                  {folderName(file.folder_id)}
                </td>

                <td
                  className="align-middle hidden lg:table-cell py-2"
                  onClick={() => goToTask(file)}
                >
                  {new Date(file.date_updated).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="">
                  <EditExportNote file={file} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>         
                
                */
}
