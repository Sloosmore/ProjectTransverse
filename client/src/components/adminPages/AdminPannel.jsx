import { useAdmin } from "@/hooks/admin/adminContext";
import Utable from "./userTable/uTable";
import SaveUsers from "./userTable/save";
import imgLogo from "../../assets/greyFull.png";
import { useAuth } from "@/hooks/userHooks/auth";
import ToggleTheme from "../appPages/content/top/toggleTheme";
const AdminPanel = () => {
  const { account, user } = useAdmin();
  const { signOut } = useAuth();

  const user_array = [
    { num: account?.premium_licenses, name: "Premium Licenses" },
    { num: account?.standard_licenses, name: "Standard Licenses" },
  ];

  return (
    <div className="p-10 md:px-20 lg:px-40 flex flex-col h-full">
      <div className="flex flex-row justify-between items-center">
        <h2>{account?.name || "loading"}</h2>

        <div className="flex-row flex">
          {user_array.map((type, index) => (
            <div className="flex flex-col items-end ms-8" key={index}>
              <p className="bold text-2xl">{` ${type.num}` || "loading"}</p>
              <p className="text-sm text-gray-500">{type.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 mt-4">
        <Utable />
      </div>
      <SaveUsers />
      <div className="mt-auto flex justify-center h-12 border-t flex-row text-lg bold pt-5 text-gray-400 dark:text-gray-300  ">
        <a
          target="#"
          className="hover:cursor-pointer underline	hover:text-gray-600 dark:hover:text-gray-200"
        >
          vrse.ai
        </a>{" "}
        <p className="ms-3 px-2">|</p>
        <ToggleTheme />
        <p className="me-3  px-2">|</p>
        <button
          onClick={signOut}
          className="underline hover:text-gray-600 dark:hover:text-gray-200"
        >
          log out
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
