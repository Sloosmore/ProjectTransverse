import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchAccount } from "@/api/admin/readAccount";
import { fetchUsers } from "@/api/admin/readUsers";

const AdminContext = createContext({
  account: {},
  users: [],
  setUsers: () => {},
});

const AdminProvider = ({ children, accountID }) => {
  const [account, setAccount] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const configData = async () => {
      if (accountID) {
        const accountData = await fetchAccount(accountID);
        console.log(accountData);
        setAccount(accountData);

        const usersData = await fetchUsers(accountData.email_extension);
        setUsers(usersData);
        console.log(usersData);
      }
    };
    configData();
  }, [accountID]);

  return (
    <AdminContext.Provider value={{ account, users, setUsers }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

export const useAdmin = () => {
  return useContext(AdminContext);
};
