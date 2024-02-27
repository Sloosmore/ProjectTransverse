import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import { Offcanvas } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  updateTitle,
  updateVis,
  saveNoteMarkdown,
  deleteRecord,
} from "../../services/crudApi";

export function SheetDemo({ canvasEdit, handleClose, file }) {
  const { showOffCanvasEdit, setOffCanvasEdit } = canvasEdit;

  const [title, setTitle] = useState(file ? file.title : "");
  const [visible, setVisible] = useState(file ? file.visible : "");
  const [markdown, setMarkdown] = useState(file ? file.full_markdown : "");
  const [noteID, setNoteID] = useState(file ? file.note_id : "");
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    setTitle(file ? file.title : "");
    setVisible(file ? file.visible : "");
    setMarkdown(file ? file.full_markdown : "");
    setNoteID(file ? file.note_id : "");
  }, [showOffCanvasEdit, file]);

  const updateNote = (file, markdown, visible, title, noteID, setShowAlert) => {
    if (file) {
      saveNoteMarkdown(noteID, markdown);
      updateVis(noteID, visible);
      updateTitle(noteID, title);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
