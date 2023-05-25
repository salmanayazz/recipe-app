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
            className="bg-pri-200 flex-1"
            value={textValue}
        >
        </input>
    );
}