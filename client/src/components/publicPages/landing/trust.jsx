import tmoble from "../../../assets/logos/t-mobile.png";
import microsoft from "../../../assets/logos/microsoft.png";
import stanford from "../../../assets/logos/stanford.png";
import usc from "../../../assets/logos/usc.png";

function TrustedBy() {
  return (
    <div className="w-full flex justify-center mb-20 flex-col mt-20 md:mt-14">
      <h2 className="text-gray-500 text-center mb-16">
        Trusted by Employees and Students from:
      </h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 lg:gap-x-12 gap-y-12 place-content-evenly justify-items-center md:mx-20">
        <img src={tmoble} alt className="h-10" />
        <img src={stanford} alt className="h-10" />
        <img src={microsoft} alt className="h-10" />
        <img src={usc} alt className="h-10" />
      </div>
    </div>
  );
}

export default TrustedBy;
