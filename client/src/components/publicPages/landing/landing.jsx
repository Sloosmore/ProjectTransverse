import BlockText from "./landed";
import TrustedBy from "./trust";
import Footer from "../footer";
import Waitlist from "../waitlist/waitlist.jsx";
function Landing() {
  return (
    <div>
      <div className="flex flex-col bg-light shadow-lg  ">
        <BlockText />
        <TrustedBy />
        <Waitlist />
      </div>
      <Footer />
    </div>
  );
}

export default Landing;
