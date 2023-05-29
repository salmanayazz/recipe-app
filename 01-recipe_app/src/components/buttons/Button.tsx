interface ButtonProps {
    element: string | JSX.Element;
    type?: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
}

export default function Button({
    type = "button",
    element,
    onClick
}: ButtonProps ) {
    return (
        <button 
            type={type}
            onClick={onClick}
            className="bg-pri-200 text-sec-100 py-2 px-6 rounded-md"
        >
            {element}
        </button>
    );
}