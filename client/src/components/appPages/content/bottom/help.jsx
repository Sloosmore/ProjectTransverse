import HelpModalShad from "../../modalsToast/helpShad";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

function Help() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const closeModal = () => setShowHelpModal(false);

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="border border-gray-200 right-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-200 hover:bg-gray-200 hover:text-gray-600 shadow-sm ring-1 ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-100 transition duration-300 ease-in-out "
            onClick={() => setShowHelpModal(true)}
          >
            <i className="bi bi-question"></i>
          </button>
        </DialogTrigger>

        <HelpModalShad show={showHelpModal} onClose={closeModal} />
      </Dialog>
    </div>
  );
}

export default Help;
