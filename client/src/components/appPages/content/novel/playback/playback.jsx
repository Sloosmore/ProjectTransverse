import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Transcript from "../transcript/transcript";

function Playback() {
  const [playbackState, setPlaybackState] = useState("Transcript");
  const handleSelect = (value) => {
    setPlaybackState(value);
  };
  return (
    <div className="md:me-10">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <i
            className="bi bi-collection-play p-2.5 hover:bg-gray-100 rounded cursor-pointer"
            style={{ fontSize: "1.1rem" }}
          ></i>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-1.5">
          <DropdownMenuLabel>Audio Playback</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Select onChange={handleSelect} className="">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Playback"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Transcript">Transcript</SelectItem>
              <SelectItem value="Edit">Edit</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Speed here</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Playback;
