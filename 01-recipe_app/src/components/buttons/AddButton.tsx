import Button from "./Button";

interface AddButtonProps {
    onClick?: () => void
}

export default function AddButton({
    onClick
}: AddButtonProps) {

    return (
        <Button 
            text='+'
            onClick={onClick}
        />
    )
}