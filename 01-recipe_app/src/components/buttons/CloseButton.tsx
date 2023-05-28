import Button from "./Button";

interface CloseButtonProps {
    onClick?: () => void
}

export default function CloseButton({
    onClick
}: CloseButtonProps) {

    return (
        <button
            className="fill-sec-100"
            onClick={onClick}
            type="button"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="48" 
                viewBox="0 -960 960 960" 
                width="48"
                className="w-6 h-6" // TODO: fontsize variable
            >
                    <path 
                        d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"
                    />
            </svg>
        </button>
    )
}