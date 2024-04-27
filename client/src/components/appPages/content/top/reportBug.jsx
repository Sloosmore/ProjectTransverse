import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useAuth } from "@/hooks/userHooks/auth";

import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "../../../../config/supabaseClient";

export function ReportBug() {
  const { user } = useAuth();
  const handleSubmit = async (e) => {
    const bugReport = document.getElementById("bugReport").value;
    if (bugReport.length === 0) {
      toast.error("Please describe the bug");
      e.preventDefault();

      return;
    } else {
      try {
        const { data, error } = await supabaseClient.from("bug").insert({
          bug_description: bugReport,
          user_id: user.id,
        });

        if (error) {
          throw error;
        }

        // Handle successful bug report submission here
        // For example, clear the textarea and show a success message
        document.getElementById("bugReport").value = "";
        toast.success("Bug reported successfully");
      } catch (error) {
        console.error("Error reporting bug:", error);
        toast.error("Error reporting bug");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          as="a"
          className="block rounded-md px-3 py-2 text-base text-gray-400 dark:hover:text-white dark:text-gray-300 hover:text-gray-700"
        >
          <i className="bi bi-bug" style={{ fontSize: "1.25rem" }}></i>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[36rem]">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
        </DialogHeader>
        <Textarea
          id="bugReport"
          className=" w-full h-40 border-gray-400 border rounded min-h-12 max-h-96 p-2"
          placeholder="Describe the bug here..."
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSubmit}>
              <i className="bi-send bi" style={{ fontSize: "1.25rem" }}></i>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReportBug;
