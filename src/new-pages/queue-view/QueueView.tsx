import React, {FC} from "react";
import Queue from "./queue/Queue";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const QueueView: FC = () => {
  const scrollingText =
      "Stay on this page until timeout. You will be redirected to the ticket purchase page automatically.";

  return (
      <React.Fragment>
          <div className="w-full h-auto p-5 gap-4 flex flex-col fixed flex flex-col left-0 right-0 items-center justify-center ">
              <div className="w-full gap-4 min-[375px]:overflow-y-auto min-[375px]:h-[60vh] min-[414px]:h-[60vh] lg:h-full lg:overflow-y-hidden sticky lg:md:w-1/2">
                  <Queue/>
              </div>
              <GlobalFooter
                  text={scrollingText}
              />
          </div>

      </React.Fragment>
  );
};

export default QueueView;
