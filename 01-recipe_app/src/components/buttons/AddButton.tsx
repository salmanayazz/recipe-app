interface AddButtonProps {
    onClick?: () => void
}

export default function AddButton({
    onClick
}: AddButtonProps) {

    return (
        <button
            onClick={onClick}
            className="fill-sec-100 rounded"
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
                    d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z"
                />
            </svg>
        </button>
    )
}