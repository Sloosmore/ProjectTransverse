import HelpModalShad from "../../modalsToast/helpShad";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Help({ helpModalKit }) {
  const { showHelpModal, setShowHelpModal, closeModal } = helpModalKit;

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="border border-gray-200 right-0 w-8 h-8 rounded-full bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-600 shadow-sm ring-1 ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-100 transition duration-300 ease-in-out "
            onClick={() => setShowHelpModal(true)}
          >
            <i className="bi bi-question-lg"></i>
          </button>
        </DialogTrigger>

        <HelpModalShad show={showHelpModal} onClose={closeModal} />
      </Dialog>
    </div>
  );
}

export default Help;
