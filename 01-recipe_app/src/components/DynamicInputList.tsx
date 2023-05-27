import { useEffect, useState } from "react";

import uniqid from "uniqid";

import TextInput from "./TextInput";
import CloseButton from "./buttons/CloseButton";
import AddButton from "./buttons/AddButton";
import List from "./List";


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

    // array of JSX elements that then gets passed to list component to be rendered
    const [inputs, setInputs] = useState<JSX.Element[]>([])

    useEffect(() => {
        const generateInputArray = () => {
            const newInputs: JSX.Element[] = [];
    
            // Generate the JSX elements based on the parameters
            for (let i = 0; i < textValues.length; i++) {
                const newInput = (
                    <div
                        className="flex w-full"
                    >
                        <TextInput
                            onChange={(value) => onChange(i, value)}
                            //textValue={textValue.value || ""}
                            // autofocus if last input but not first
                            autoFocus={i === textValues.length - 1 && i !== 0}
                        />
                    
                        { i === 0 ? (
                            null
                        ) : (
    
                            <CloseButton
                                onClick={() => removeAt(i)} 
                            />
                        )}
                    </div>
                );
    
                newInputs.push(newInput);
            }
    
            return newInputs;
        }

        const newInputs = generateInputArray();
        setInputs(newInputs);
    }, [textValues, onChange, removeAt]) // TODO: change to use useCallback for onChange, removeAt

    

    return (
        <div>
            <List
                values={inputs}
                isOrdered={orderedList}
            />
            <AddButton
                onClick={() => increaseCount()} 
            />
        </div>
    );
}