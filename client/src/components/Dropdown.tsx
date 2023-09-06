import React, { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronLeft } from 'react-icons/fi';

interface DropdownItem {
  element: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  triggerElement: React.ReactNode;
}

export default function Dropdown({ 
    items, 
    triggerElement 
}: DropdownProps) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdown = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event: any) => {
        if (dropdown.current && !dropdown.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    return (
        <div
            className="relative"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            ref={dropdown}
        >
            <div
                className="flex items-center cursor-pointer text-sec-200 gap-1"
            >
                {triggerElement}
                { isDropdownOpen ? (
                    <FiChevronDown />
                    
                ) : (
                    <FiChevronLeft />
                )}
            </div>
        
            {isDropdownOpen && (
                <div
                    className="absolute bg-pri-300 text-sec-200 text-sm p-2 rounded-lg shadow-md"
                >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center cursor-pointer hover:text-red-500"
                        onClick={() => {
                            item.onClick?.();
                            setDropdownOpen(false);
                        }}
                    >
                        {item.element}
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};