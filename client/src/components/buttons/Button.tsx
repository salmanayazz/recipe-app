import LoadingAnimation from "../LoadingAnimation";

interface ButtonProps {
  element: string | JSX.Element;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  error?: string;
}

export default function Button({
  type = "button",
  element,
  onClick,
  loading = false,
  error,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-pri-300 text-sec-100 py-2 px-4 
            rounded-md outline-none border-2 border-pri-300 hover:bg-pri-200 
            transition-transform duration-200 active:translate-y-0.5 flex-1 ${
              error ? "border-red-500" : ""
            }`}
    >
      {error ? (
        <span className="text-red-500">{error}</span>
      ) : loading ? (
        <LoadingAnimation />
      ) : (
        element
      )}
    </button>
  );
}
