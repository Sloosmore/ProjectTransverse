import tmoble from "../../../assets/trustLogos/t-mobile.png";
import microsoft from "../../../assets/trustLogos/microsoft.png";
import stanford from "../../../assets/trustLogos/stanford.png";
import usc from "../../../assets/trustLogos/usc.png";

function TrustedBy() {
  return (
    <div className="w-full flex justify-center my-8 sm:my-12 flex-col  md:mt-14 px-4 sm:px-0">
      <h2 className="text-gray-500 text-center sm:mb-16 text-4xl mx-6">
        Trusted by Employees and Students from:
      </h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 lg:gap-x-12 gap-y-12 place-content-evenly justify-items-center md:mx-20 my-10">
        <img src={tmoble} className="h-10" />
        <img src={stanford} className="h-10" />
        <img src={microsoft} className="h-10" />
        <img src={usc} className="h-10" />
      </div>
    </div>
  );
}

export default TrustedBy;
