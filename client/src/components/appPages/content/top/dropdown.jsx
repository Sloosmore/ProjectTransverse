import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ControlModalShad from "./userPref/ControlModelShad";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProfIcon({ logOut }) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex">
          <div className=" flex justify-center items-center ml-auto mr-auto w-12 h-12 justify-center gap-x-1.5 px-3 text-sm font-semibold text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
            <LogOut className={cn("h-5 w-5", {})} />
          </div>{" "}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[36rem]">
        <div className="flex justify-center">
          <Button variant="destructive" onClick={logOut}>
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ProfIcon;

{
  /*
      <div className=" justify-center items-center">
        <Menu as="div" className="relative inline-block text-left w-full">
          <div>
            <Menu.Button className=" flex justify-center items-center ml-auto mr-auto w-12 h-12 justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-400 hover:text-gray-700">
              <LogOut className={cn("h-5 w-5", {})} />
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
                      </Menu>       </div>
    </>*/
}
/*
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
              </Menu.Item> */
