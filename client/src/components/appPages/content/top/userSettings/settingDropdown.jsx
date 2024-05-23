import ProfIcon from "../dropdown";
import ReportBug from "./reportBug";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/userHooks/auth";
import KeyCode from "./keyCode";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function ProfDrop() {
  const { signOut } = useAuth();
  const [isBugDialogOpen, setIsBugDialogOpen] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);

  return (
    <div>
      <Dialog
        open={isBugDialogOpen || isKeyDialogOpen}
        onOpenChange={isBugDialogOpen ? setIsBugDialogOpen : setIsKeyDialogOpen}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <i
              className="bi bi-person ms-2  text-gray-400 dark:hover:text-white dark:text-gray-300 hover:text-gray-700"
              style={{ fontSize: "1.5rem" }}
            ></i>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <button
                className="flex w-full flex-row justify-between py-1"
                onClick={signOut}
              >
                <span>Log Out</span>{" "}
                <LogOut
                  className={cn(
                    "h-5 w-5 rounded-md text-base text-gray-400 dark:hover:text-white dark:text-gray-300 hover:text-gray-700",
                    {}
                  )}
                />
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsBugDialogOpen(true)}>
              <button className="flex flex-row justify-between items-center w-full py-1">
                <span>Report Bug</span>
                <div
                  as="a"
                  className="rounded-md text-base text-gray-400 dark:hover:text-white dark:text-gray-300 hover:text-gray-700"
                >
                  <i
                    className="bi bi-bug flex"
                    style={{ fontSize: "1.25rem" }}
                  ></i>
                </div>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsKeyDialogOpen(true)}>
              <button className="flex w-full flex-row justify-between py-1">
                <span>Code</span>{" "}
                <Key
                  className={cn(
                    "h-5 w-5 rounded-md text-base text-gray-400 dark:hover:text-white dark:text-gray-300 hover:text-gray-700"
                  )}
                />
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isBugDialogOpen ? <ReportBug /> : <KeyCode />}
      </Dialog>
    </div>
  );
}
