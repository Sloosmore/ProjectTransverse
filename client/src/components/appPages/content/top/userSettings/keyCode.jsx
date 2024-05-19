import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/userHooks/auth";
import { LogOut, Key } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "../../../../../config/supabaseClient";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function KeyCode() {
  const { user, setAccountID, setUserType, session } = useAuth();
  const [code, setCode] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    if (code.length === 0) {
      toast.error("Please describe the bug");
      e.preventDefault();

      return;
    } else {
      try {
        const token = session.access_token;

        const promise = await fetch(
          `${import.meta.env.VITE_BASE_URL}/settings/adminCode`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!promise.ok) {
          const text = await promise.text();
          throw new Error(text);
        }
        const data = await promise.json();

        if (data.Admin) {
          setUserType("Admin");
          setAccountID(code);
          navigate("/admin");
        } else toast.warning("incorrect code");
      } catch (error) {
        console.error("Error reporting bug:", error);
        toast.error("Error reporting bug");
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[36rem]">
      <DialogHeader>
        <DialogTitle>Code?</DialogTitle>
      </DialogHeader>
      <Input
        onChange={(e) => setCode(e.target.value)}
        className=" w-full border-gray-400 border rounded min-h-12 max-h-96 p-2"
        placeholder="Put in code"
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit" onClick={handleSubmit}>
            <i className="bi-send bi" style={{ fontSize: "1.25rem" }}></i>
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default KeyCode;
