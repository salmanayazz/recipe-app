import Button from "./Button";

interface CloseButtonProps {
    onClick?: () => void
}

export default function CloseButton({
    onClick
}: CloseButtonProps) {

    return (
        <Button 
            text='X'
            onClick={onClick}
        />
    )
}