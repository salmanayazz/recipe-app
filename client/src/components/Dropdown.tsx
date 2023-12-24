import React, { useEffect, useState, useRef } from "react";
import { FiChevronDown, FiChevronLeft } from "react-icons/fi";

interface DropdownItem {
  element: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  triggerElement: React.ReactNode;
}

export default function Dropdown({ items, triggerElement }: DropdownProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center"
      onClick={() => setDropdownOpen(!isDropdownOpen)}
      ref={dropdown}
    >
      <div className="flex items-center cursor-pointer text-sec-200 space-x-1">
        {triggerElement}
        {isDropdownOpen ? <FiChevronDown /> : <FiChevronLeft />}
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 bg-pri-300 text-sec-200 p-2 rounded-lg shadow-md">
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
}
