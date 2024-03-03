import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ControlModalShad from "../../modalsToast/ControlModelShad";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProfIcon({ logOut, noteData, controlProps }) {
  const [show, setShow] = useState(false);
  return (
    <div className=" justify-center items-center">
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <Menu.Button className="rounded-full flex justify-center items-center ml-auto mr-auto w-12 h-12 justify-center gap-x-1.5 rounded-circle bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500 shadow hover:bg-gray-200">
            <i
              className="bi bi-person-circle"
              style={{ fontSize: "1.5rem" }}
            ></i>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none me-2">
            <div className="py-1">
              <Menu.Item>
                <SheetTrigger asChild>
                  <button
                    className={classNames(
                      "text-gray-700 block w-full px-4 py-2  text-left  text-sm hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={() => setShow(!show)}
                  >
                    Note settings
                  </button>
                </SheetTrigger>
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                    onClick={() => logOut()}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
export default ProfIcon;
