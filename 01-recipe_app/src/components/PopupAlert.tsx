import { useEffect, useState } from "react"

import Header2 from "./headers/Header2";

interface PopupAlertProps {
    element: string
    type?: 'neutral' | 'error' | 'success'
}

export default function PopupAlert({
    element,
    type = 'neutral'
}: PopupAlertProps) {

    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 6000)
    }, [element])

    return(
        <>
            {isVisible ? (
                <div
                    className="bg-pri-200 absolute bottom-1 right-1 px-20 py-10 mb-5 rounded-s-md"
                >
                    <Header2
                        text={element}
                    />
                </div>
            ) : (
                null
            )}
        </>
        
        
    )
}