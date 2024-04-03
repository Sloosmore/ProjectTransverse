import BlockText from "./landed";
import TrustedBy from "./trust";
import Footer from "../footer";
import Waitlist from "../waitlist/waitlist.jsx";
import Corner from "./feature";
function Landing() {
  return (
    <div>
      <div className="flex flex-col bg-light shadow-lg  ">
        <BlockText />
        <TrustedBy />
        <Waitlist />

        {/*<Corner />*/}
      </div>
      <Footer />
    </div>
  );
}

export default Landing;
