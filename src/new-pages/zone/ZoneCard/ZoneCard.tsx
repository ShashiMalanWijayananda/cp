import "./ZoneCard.css";
import React, { FC } from "react";
import { IZone } from "../../../interfaces/data.interfaces";

interface ZoneCardProps {
  zone?: IZone;
  onClick?: (zone: IZone) => void;
}

const ZoneCard: FC<ZoneCardProps> = ({ zone, onClick }) => {
  const isCompleted = !zone?.available;

  // Debug log
  console.log("Zone data in card:", zone);

  return (
    <React.Fragment>
      <div
        className={`zone-card ${zone?.zoneId} ${
          isCompleted ? "completed" : ""
        }`}
        onClick={() => !isCompleted && onClick?.(zone)}
      >
        <div className={"zone-content-z"}>
          {isCompleted && (
            <div className="mission-completed">Mission completed</div>
          )}
          <div className="zone-view-desc">
            <span className={"zone-text"}>
              {zone?.zoneId?.replace("zone", "ZONE ") || "ZONE"}
            </span>
            <span className="zone-content-desc">
              Available Slots:{" "}
              {zone?.remainingTicket?.toString()?.padStart(4, "0") || "0000"}
            </span>
          </div>
        </div>

        {isCompleted && <div className="completed-overlay"></div>}
      </div>
    </React.Fragment>
  );
};

export default ZoneCard;
