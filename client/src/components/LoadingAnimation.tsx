import { useEffect, useState, useRef } from "react";

export default function LoadingAnimation({}) {
    const dot1 = useRef<HTMLParagraphElement | null>(null);
  const dot2 = useRef<HTMLParagraphElement | null>(null);
  const dot3 = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        // toggle display of dots
        const interval = setInterval(() => {
            if (dot1.current?.className.includes('invisible')) {
                dot1.current?.classList.remove('invisible');
            } else if (dot2.current?.className.includes('invisible')) {
                dot2.current?.classList.remove('invisible');
            } else if (dot3.current?.className.includes('invisible')) {
                dot3.current?.classList.remove('invisible');
            } else {
                dot1.current?.classList.add('invisible');
                dot2.current?.classList.add('invisible');
                dot3.current?.classList.add('invisible');
            }
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="flex justify-center items-center gap-2"
        >
            <p
                ref={dot1}
            >●</p>
            <p
                ref={dot2}
            >●</p>
            <p
                ref={dot3}
            >●</p>
        </div>
    );
}