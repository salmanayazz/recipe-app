interface TextInputProps {
    placeholder: string,
    onChange: (value: string) => void,
    autoFocus?: boolean,
    autoComplete?: boolean
}


export default function TextInput({
    placeholder,
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
            className="bg-pri-200"
        >

        </input>
    );
}