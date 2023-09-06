import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import icons from react-icons library

interface TextInputProps {
    label?: string;
    placeholder?: string;
    textValue?: string;
    error?: string;
    required?: boolean;
    hidden?: boolean;
    onChange: (value: string) => void;
    autoFocus?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function TextInput({
    label,
    placeholder,
    textValue = "",
    error,
    required = false,
    hidden = false,
    onChange,
    autoFocus = false,
    onKeyDown,
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col relative">
            {label && (
                <label className="text-sec-100 mb-1">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <div className={`flex flex-row ${hidden ? "relative" : ""}`}>
                <input
                    type={hidden ? (showPassword ? "text" : "password") : "text"} 
                    placeholder={placeholder}
                    value={textValue}
                    onChange={(e) => onChange(e.target.value)}
                    autoFocus={autoFocus}
                    autoComplete="off"
                    className={`bg-pri-300 text-sec-100 outline-none border-2 ${
                        error ? "border-red-500" : "border-pri-300"
                    } rounded-md p-2 ${
                        hidden ? "pr-10" : "pr-2" // if hidden, add padding to the right for the eye icon
                    } focus:bg-pri-200 w-full`}
                    onKeyDown={onKeyDown}
                />
                {hidden && (
                    <button
                        type="button"
                        className=" text-sec-200 absolute top-1/2 right-3 transform -translate-y-1/2"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
    );
}