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
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"
        >
            <div 
                className="flex flex-col bg-pri-200
                items-center z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <div 
                    className='flex justify-end w-full absolute'
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