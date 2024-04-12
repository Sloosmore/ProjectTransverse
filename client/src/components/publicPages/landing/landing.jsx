import BlockText from "./landed";
import TrustedBy from "./trust";
import Footer from "../footer";
import Waitlist from "../waitlist/waitlist.jsx";
import NoteTakingReasons from "./reasons";
import VrseFix from "./solution";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
function Landing() {
  const { user } = useAuth();

  const navigate = useNavigate();

  if (user) {
    navigate("/app/folder-grid");
  }
  return (
    <div>
      <div className="flex flex-col bg-light shadow-lg  ">
        <BlockText />
        <TrustedBy />
        <NoteTakingReasons />
        <VrseFix />
        <Waitlist />
      </div>
      <Footer />
    </div>
  );
}

export default Landing;
