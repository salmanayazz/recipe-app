interface PopupAlertProps {
    element: JSX.Element | string
}

export default function PopupAlert({
    element
}: PopupAlertProps) {

    return(
        <div
            className="absolute"
        >
            {element}
        </div>
    )
}