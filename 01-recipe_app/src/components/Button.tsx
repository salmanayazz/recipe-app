interface ButtonProps {
    text: string;
    type: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
}

export default function Button({
    type,
    text,
    onClick
}: ButtonProps ) {
    return (
        <button 
            type={type}
            onClick={onClick}
            className="bg-pri-100 text-sec-100"
        >
            {text}
        </button>
    );
}