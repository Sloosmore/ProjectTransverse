import React from "react";

import { Button } from "@/components/ui/button";
import { updateUsers } from "@/api/admin/updateUsers";
import { useAdmin } from "@/hooks/admin/adminContext";
import { toast } from "sonner";

const SaveUsers = () => {
  const { users } = useAdmin();
  return (
    <div>
      <Button
        onClick={() => {
          updateUsers(users);
          toast.success("Users updated");
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default SaveUsers;
