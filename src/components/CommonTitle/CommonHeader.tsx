import React, { FC } from "react";
import "./CommonHeader.css";

const CommonHeader: FC = () => {
  return (
    <div className="common-header-container" role="banner" aria-label="Yogeshwari common header">
      {/* Mobile: logo only (no border box) */}
      <img
        src="images/logo/Logo-animate-wothout-Blink1.gif"
        alt="Yogeshwari logo"
        className="common-header-logo-mobile"
      />

      {/* Tablet/Desktop: centered logo inside bordered bar */}
      <div className="common-header-bar" aria-hidden="true">
        <img
          src="images/logo/Logo-animate-wothout-Blink1.gif"
          alt=""
          className="common-header-logo-desktop"
        />
      </div>
    </div>
  );
};

export default CommonHeader;
