import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import icon from "../../../../assets/TransverseIcon.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../hooks/userHooks/auth";
import ControlModalShad from "./userPref/ControlModelShad";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ProfIcon from "./dropdown";
import ReportBug from "./reportBug";
import ToggleTheme from "./toggleTheme";
import ControlDrawerShad from "./userPref/PrefDrawer";

function AppNav() {
  const { user, signOut } = useAuth();

  const logOut = () => {
    signOut();
  };

  return (
    <div>
      <Disclosure
        as="nav"
        className="bg-white dark:bg-[#020817] shadow-sm dark:border-b dark:border-gray-800"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to="/app/folder-grid">
                      <img className="h-8 w-8" src={icon} alt="Transverse" />
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}

                    <ControlModalShad />

                    <ProfIcon logOut={signOut} />
                    <ReportBug />
                    <ToggleTheme />
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-200">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden rounded">
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4 ">
                  <div className="flex-shrink-0 text-gray-500">
                    <i className="bi bi-person-circle "></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-4">
                  <ControlDrawerShad />

                  <Disclosure.Button
                    as="a"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    onClick={() => logOut()}
                  >
                    Log Out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default AppNav;
