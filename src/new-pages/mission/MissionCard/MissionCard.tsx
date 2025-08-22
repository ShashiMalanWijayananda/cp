import "./MissionCard.css";
import React, { FC, useEffect, useState } from "react";
import { IEvent } from "../../../interfaces/data.interfaces";
import "../../../App.css";

interface MissionCardProps {
  concert: IEvent;
  onEnter: (concert: IEvent) => void;
  loader?: boolean;
}

const MissionCard: FC<MissionCardProps> = ({ concert, onEnter, loader }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
      <React.Fragment>
        <div className={`mission-card-1 ${concert?.theme ?? "green"}`}>
          <div className={"mission-header"}>
            <div className={"mission-title"}>{concert?.eventName ?? ""}</div>
            <div className={"mission-sub-title"}>Concert</div>
          </div>

          {!isMobile ? (
              <>
                {" "}
                <div className={"block"}>
                  <div className={"block1"}>
                    <div className={"venue"}>
                      <span className={"text1"}>Venue</span>
                      <span className={"text3"}>
                    {concert?.locationCode ?? "-"}
                  </span>
                      <span className={"text2"}>
                    {concert?.eventLocation ?? ""}
                  </span>
                    </div>
                    <div className={"submarine"}></div>
                  </div>

                  <div className={"block2"}>
                    <div className={"date"}>
                      <div className={"date1"}>
                        {concert?.eventDateString ?? ""}
                      </div>
                      <div className={"time"}>{concert?.eventTime ?? ""}</div>
                    </div>
                    <div className={"rad"}></div>
                  </div>
                </div>
              </>
          ) : (
              <>
                {" "}
                <div className={"block"}>
                  <div className={"block1"}>
                    <div className={"venue"}>
                      <span className={"text1"}>Venue</span>
                      <span className={"text3"}>
                    {concert?.locationCode ?? "-"}
                  </span>
                      <span className={"text2"}>
                    {concert?.eventLocation ?? ""}
                  </span>
                    </div>
                    <div className={"venue2"}>
                      <div className={"date1"}>
                        {concert?.eventDateString ?? ""}
                      </div>
                      <div className={"time"}>{concert?.eventTime ?? ""}</div>
                    </div>
                  </div>
                </div>
              </>
          )}

          <div className={"signal"}></div>

          {concert?.available ? (
              <div
                  className={`btn-enter-mission ${
                      concert?.available ? "" : "disabled"
                  }`}
                  onClick={() => onEnter(concert)}
              >
                {loader ? "Entering..." : "Enter Mission"}
              </div>
          ) : (
              <div className={"description"}>Mission Full</div>
          )}
        </div>
      </React.Fragment>
  );
};

export default MissionCard;
