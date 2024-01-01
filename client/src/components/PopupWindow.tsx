import React, { useEffect } from "react";
import CloseButton from "./buttons/CloseButton";

interface PopupWindowProps {
  element: JSX.Element;
  onExit: () => void;
  size?: "small" | "medium" | "large";
}

export default function PopupWindow({
  element,
  onExit,
  size = "medium",
}: PopupWindowProps) {
  let sizeToStyle: React.CSSProperties["width"];

  if (size === "small") {
    sizeToStyle = "min(90%, 30rem)";
  } else if (size === "medium") {
    sizeToStyle = "min(90%, 55rem)";
  } else {
    sizeToStyle = "min(90%, 80rem)";
  }

  useEffect(() => {
    // disable scrolling when popup window is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      // blurred background
      id="popup-window"
      className="fixed inset-0 bg-[#00000080] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onExit();
        }
      }}
    >
      <div
        className={`flex flex-col bg-pri-100 z-10 absolute top-1/2 left-1/2 -translate-x-1/2 transform -translate-y-1/2 rounded-md max-h-[90%]`}
        style={{ width: sizeToStyle }}
      >
        <div className="overflow-y-auto overflow-x-hidden py-5 px-8">
          {element}
        </div>

        <div className="flex absolute top-3 right-3">
          <CloseButton onClick={onExit} />
        </div>
      </div>
    </div>
  );
}
