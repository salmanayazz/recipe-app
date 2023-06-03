import { useCallback, useEffect, useState } from "react";

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
 * @function removeAt
 * A function that removes a text input with the given ID
 * @function onChange
 * A function that updates the value of a text input at a given index
 * @function increaseCount
 * increases the textValues size when called
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

    /**
     * increases input count when user hits the enter key
     * @param e - keyboard event
     */
    const listenForEnterKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            increaseCount();
        }
    }, [increaseCount] )

    /**
     * regenerates inputs and puts them into a array to then pass to the List component
     * @returns - JSX array for containing the inputs
     */
    const generateInputArray = useCallback(() => {
        const newInputs: JSX.Element[] = [];

        // Generate the JSX elements based on the parameters
        for (let i = 0; i < textValues.length; i++) {
            const newInput = (
                <div
                    className="flex w-full justify-center items-center"
                >
                    <TextInput
                        onChange={(value) => onChange(i, value)}
                        textValue={textValues[i].value}
                        // autofocus if last input but not first
                        autoFocus={i === textValues.length - 1 && i !== 0}
                        onKeyDown={listenForEnterKey}
                    />

                    <div
                        // if theres only one input, do not show the remove button 
                        // set first button invisible to keep all inputs aligned 
                        className={(textValues.length === 1 && i === 0) ? ('invisible') : ('')}
                    >
                        <CloseButton
                            onClick={() => removeAt(i)} 
                        />
                    </div>
                </div>
            );

            newInputs.push(newInput);
        }

        return newInputs;
    }, [listenForEnterKey, onChange, removeAt, textValues])

    /**
     * regenerate array when textValues updates 
     */
    useEffect(() => {
        const newInputs = generateInputArray();
        setInputs(newInputs);
    }, [textValues, onChange, removeAt, listenForEnterKey, generateInputArray])

    return (
        <div>
            <List
                values={inputs}
                isOrdered={orderedList}
            />
            <AddButton
                onClick={() => {
                    increaseCount()
                    //TODO: set autofocus on last input after button press
                }} 
            />
        </div>
    );
}