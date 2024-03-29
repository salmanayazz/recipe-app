import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  textValue?: string;
  error?: string;
  errorOutline?: boolean;
  required?: boolean;
  hidden?: boolean; // for password inputs
  onChange: (value: string) => void;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  leftIcon,
  rightIcon,
  errorOutline = false,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-1 flex-col relative">
      {label && (
        <label className="text-sec-100 mb-1">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className={`flex flex-1 flex-row ${hidden ? "relative" : ""}`}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {leftIcon}
          </div>
        )}
        <input
          type={hidden ? (showPassword ? "text" : "password") : "text"}
          placeholder={placeholder}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          autoComplete="off"
          className={`bg-pri-300 text-sec-100 outline-none border-2 ${
            error || errorOutline ? "border-red-500" : "border-pri-300"
          } rounded-md p-1.5 ${
            hidden ? "pr-10" : "pr-2" // if hidden, add padding to the right for the eye icon
          } focus:bg-pri-200 w-full ${
            leftIcon ? "pl-10" : "" // if leftIcon, add padding to the left
          } ${
            rightIcon ? "pr-10" : "" // if rightIcon, add padding to the right
          }`}
          onKeyDown={onKeyDown}
        />
        {hidden && (
          <button
            type="button"
            className=" text-sec-200 absolute top-1/2 right-2 transform -translate-y-1/2"
            onClick={toggleShowPassword}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
        {rightIcon && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
