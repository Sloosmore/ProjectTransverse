import { useEffect } from "react";
import { useState } from "react";
import { fetchAccount } from "@/api/admin/readAccount";
import { useAuth } from "@/hooks/userHooks/auth";
import AdminProvider from "@/hooks/admin/adminContext";
import AdminPanel from "./AdminPannel";

const AdminApp = () => {
  const { accountID } = useAuth();

  useEffect(() => {
    if (accountID) {
      fetchAccount(accountID).then(console.log);
    }
  }, [accountID]);

  return (
    <div className="h-dvh">
      <AdminProvider accountID={accountID}>
        <AdminPanel />
      </AdminProvider>
    </div>
  );
};

export default AdminApp;
