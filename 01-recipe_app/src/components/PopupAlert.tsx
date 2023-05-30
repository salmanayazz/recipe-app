import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from '../app/hooks';

import Header2 from "./headers/Header2";

import {
    selectAlert,
    clearAlert
} from '../features/alertSlice';

export default function PopupAlert() {
    const dispatch = useAppDispatch();
    const alert = useAppSelector(selectAlert);

    let timeoutRef = useRef<NodeJS.Timeout | undefined>();

    useEffect(() => {
        // reset any previous timeouts to reset the timer of new alerts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            dispatch(clearAlert());
        }, 8000)
    }, [alert.text, alert.alertType, dispatch])

    return(
        <>
            {alert.alertType ? (
                <div
                    // TODO: only have a design for error alerts right now
                    className={`absolute bottom-1 right-1 px-12 py-10 mb-5 rounded-s-md
                    bg-error z-50`}
                >
                    {alert.text ? (
                        <Header2
                            text={alert.text}
                        />
                    ) : (
                        null
                    )}
                    
                </div>
            ) : (
                null
            )}
        </>
        
        
    )
}