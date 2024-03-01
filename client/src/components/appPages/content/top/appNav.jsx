import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import TopProfile from "./profile";
import icon from "../../../../assets/TransverseIcon.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../hooks/auth";
import { useState } from "react";
import ControlModalShad from "../../modalsToast/ControlModelShad";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AppNav({ profileKit, controlProps, noteData }) {
  const { SpeechRecognition } = profileKit;

  const { user, signOut } = useAuth();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logOut = () => {
    signOut();
    SpeechRecognition.stopListening();
  };

  return (
    <div>
      <Disclosure as="nav" className="bg-white shadow-sm ">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to="/n">
                      <img className="h-8 w-8" src={icon} alt="Transverse" />
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Sheet>
                      <TopProfile
                        profileKit={profileKit}
                        controlProps={controlProps}
                        noteData={noteData}
                      />
                      <ControlModalShad
                        noteData={noteData}
                        controlProps={controlProps}
                      />
                    </Sheet>
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
                  <Sheet>
                    <SheetTrigger asChild>
                      <div
                        as="a"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        Account Settings
                      </div>
                    </SheetTrigger>
                    <ControlModalShad
                      noteData={noteData}
                      controlProps={controlProps}
                    />
                  </Sheet>

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
      {/*
      <ControlModal
        show={show}
        handleClose={handleClose}
        noteData={noteData}
        controlProps={controlProps}
                    />*/}
    </div>
  );
}

export default AppNav;
