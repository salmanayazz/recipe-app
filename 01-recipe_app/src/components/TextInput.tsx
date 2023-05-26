interface TextInputProps {
    placeholder?: string,
    textValue?: string,
    onChange: (value: string) => void,
    autoFocus?: boolean,
    autoComplete?: boolean
}


export default function TextInput({
    placeholder,
    textValue,
    onChange,
    autoFocus = false,
    autoComplete = false
}: TextInputProps) {

    return(
        <input 
            type="text"
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={autoFocus}
            autoComplete={autoComplete ? "on" : "off"}
            value={textValue}
            className="bg-pri-200 text-sec-100"
        />
        
    );
}