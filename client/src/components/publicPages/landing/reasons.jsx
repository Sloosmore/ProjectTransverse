import sideImage from "../../../assets/whatHappening.png";

const NoteTakingReasons = () => {
  const reasons = [
    {
      title: "You can’t fully pay attention",
      icon: "bi bi-eye-slash",
      description:
        "You are not alone, it’s hard to focus on everything at once",
    },
    {
      title: "You might miss something",
      icon: "bi bi-clock",
      description: "So much information, so little time to get it all down",
    },
    {
      title: "You don’t know what is important",
      icon: "bi bi-pencil-square",
      description: "How can you study if you don’t know what to study",
    },
  ];

  return (
    <div className=" mx-5 sm:mx-20 border-t pt-20 mt-10 items-center xl:mb-10">
      <div className="flex flex-col-reverse lg:flex-row items-center w-full justify-between h-full ">
        <div className="">
          <img
            src={sideImage}
            alt=""
            className="lg:max-h-[46rem] max-h-[35rem] ring ring-gray-100 rounded-xl shadow-lg"
          />
        </div>
        <div className="flex flex-grow justify-center">
          <div className="flex-col flex justify-center md:ms-20 mx-6 md:mx-0">
            <div className="flex flex-col ">
              <h2 className="text-4xl text-gray-500">
                Learning in the moment is tough
              </h2>
              <h3 className="text-2xl mt-4 text-gray-400 ">
                If you have struggled to keep up and understand it all you’re
                not alone
              </h3>
            </div>
            <div className="flex">
              <div className="grid lg:gap-x-12 gap-y-6 mt-8 lg:mb-0 mb-10 ">
                {reasons.map((item) => (
                  <div
                    className={`flex flex-grow items-center space-x-2 rounded-md pe-2 py-3 text-left text-sm  `}
                    key={item.title}
                  >
                    <div className="flex  h-10 w-10 items-center justify-center">
                      <i
                        className={`${item.icon} text-gray-400`}
                        style={{ fontSize: "1.25rem" }}
                      ></i>
                    </div>
                    <div>
                      <p className="text-xl text-gray-700">{item.title}</p>
                      <p className=" text-lg text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteTakingReasons;
