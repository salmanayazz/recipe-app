import { useNavigate } from 'react-router-dom';

import CloseButton from './buttons/CloseButton';

interface PopupWindowProps {
    element: JSX.Element
}

export default function PopupWindow({
    element
}: PopupWindowProps) {
    const navigate = useNavigate();

    return (
        <div 
            // blurred background
            className="fixed inset-0 bg-[#00000046] backdrop-blur-sm"
        >
            <div
                className="flex flex-col bg-pri-100 z-10 absolute top-1/2 left-1/2 transform 
                -translate-x-1/2 -translate-y-1/2 px-8 py-5 min-w-[50%] rounded-md"
            >
                <div 
                    className='flex absolute top-0 right-0'
                >
                    <CloseButton 
                        onClick={() => navigate(-1)}     
                    />
                </div>
                
                {element}
            </div>
        </div>
    )
}