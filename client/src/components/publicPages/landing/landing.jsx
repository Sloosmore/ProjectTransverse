import BlockText from "./landed";
import TrustedBy from "./trust";
import Footer from "../footer";
import Waitlist from "../waitlist/waitlist.jsx";
import NoteTakingReasons from "./reasons";
import VrseFix from "./solution";
function Landing() {
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
