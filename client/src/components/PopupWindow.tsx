import CloseButton from "./buttons/CloseButton";

interface PopupWindowProps {
  element: JSX.Element;
  onExit: () => void;
}

export default function PopupWindow({ element, onExit }: PopupWindowProps) {
  return (
    <div
      // blurred background
      id="popup-window"
      className="fixed inset-0 bg-[#00000046] backdrop-blur-sm"
    >
      <div
        className="flex flex-col bg-pri-100 z-10 absolute top-1/2 left-1/2 transform 
                -translate-x-1/2 -translate-y-1/2 px-8 py-5 min-w-[90%] max-w-[95%] overflow-x-none rounded-md max-h-screen overflow-y-auto
                md:min-w-[75%] lg:min-w-[50%]"
      >
        <div className="flex absolute top-3 right-3">
          <CloseButton onClick={onExit} />
        </div>

        {element}
      </div>
    </div>
  );
}
