import React from "react";
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";

export default function StatusBadge({ status }) {
  return (
    <span className={`statusbadge-root statusbadge-root--${status}`}>
      {status}
    </span>
  );
}
