interface ButtonProps {
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
}

export default function Button({
    type = "button",
    text,
    onClick
}: ButtonProps ) {
    return (
        <button 
            type={type}
            onClick={onClick}
            className="bg-inherit text-sec-100 w-full h-full"
        >
            {text}
        </button>
    );
}