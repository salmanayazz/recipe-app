import uniqid from "uniqid";

import Button from "./buttons/Button";
import TextInput from "./TextInput";
import OrderedList from "./lists/OrderedList";
import UnorderedList from "./lists/UnorderedList";
import CloseButton from "./buttons/CloseButton";
import AddButton from "./buttons/AddButton";

interface DynamicInputListProps {
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
export default function DynamicInputList({
    textValues,
    removeAt,
    onChange,
    increaseCount,
    orderedList = false
}: DynamicInputListProps) {

    return (
        <div>
            
            {textValues.map((textValue, index) => (
                <div
                    className="flex"
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

                        <CloseButton
                            onClick={() => removeAt(index)} 
                        />
                    )}
                </div>
            ))}
            <AddButton
                onClick={() => increaseCount()} 
            />
        </div>
    );
}