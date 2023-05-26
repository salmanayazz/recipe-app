import uniqid from "uniqid";

import Button from "./buttons/Button";
import TextInput from "./TextInput";

interface DynamicInputCountProps {
    textValues: TextValue[]
    removeAt: (index: number) => void
    onChange: (index: number, value: string) => void
    increaseCount: () => void
    orderedList?: boolean
}

export class TextValue {
    value: string;
    id: string = uniqid();
    constructor(value: string) {
        this.value = value;
    }
}

/**
 * A component that allows for a dynamic number of text inputs
 * @param textValues
 * The values of the text inputs
 * @function removeAt(valueID: string)
 * A function that removes a text input with the given ID
 * @param onChange
 * A function that updates the value of a text input at a given index
 * @param orderedList
 * Whether or not the list of inputs should be ordered
 * ordered = numbered 1, 2, 3, etc.
 */
export default function DynamicInputCount({
    textValues,
    removeAt,
    onChange,
    increaseCount,
    orderedList = false
}: DynamicInputCountProps) {
    
    return (
        <div>
            { textValues.map((textValue, index) => (
                <div 
                    key={textValue.id}
                    className=""
                >
                    <TextInput
                        onChange={(value) => onChange(index, value)}
                        //textValue={textValue.value || ""}
                        // autofocus if last input but not first
                        autoFocus={index === textValues.length - 1 && index !== 0}
                    />
                    
                    
                    { index === 0 ? (
                        null
                    ) : (
                        <Button 
                            text="X"
                            onClick={() => removeAt(index)} 
                            type="button"                    
                        />
                    )}
                </div>
            ))}

            <Button 
                text="+"
                onClick={() => increaseCount()}
                type="button"
            />
        </div>
    );
}