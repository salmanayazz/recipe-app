import { useCallback, useEffect, useState } from "react";

import uniqid from "uniqid";

import TextInput from "./TextInput";
import CloseButton from "./buttons/CloseButton";
import AddButton from "./buttons/AddButton";
import List from "./List";

interface DynamicInputListProps {
  textValues: TextValue[];
  removeAt: (index: number) => void;
  onChange: (index: number, value: string) => void;
  increaseCount: () => void;
  orderedList?: boolean;
  error?: string;
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
  orderedList = false,
  error,
}: DynamicInputListProps) {
  /**
   * increases input count when user hits the enter key
   * @param e - keyboard event
   */
  const listenForEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        increaseCount();
      }
    },
    [increaseCount]
  );

  return (
    <div>
      <List
        values={textValues.map((value, index) => (
          <div className="flex w-full justify-center items-center" key={index}>
            <TextInput
              onChange={(value) => onChange(index, value)}
              textValue={value.value}
              // autofocus if last input but not first
              autoFocus={index === textValues.length - 1 && index !== 0}
              onKeyDown={listenForEnterKey}
              errorOutline={error ? true : false}
            />
            <div
              // if theres only one input, do not show the remove button
              // set first button invisible to keep all inputs aligned
              className={`flex justify-center items-center ${
                textValues.length === 1 && index === 0 ? "invisible" : ""
              }`}
            >
              <CloseButton onClick={() => removeAt(index)} />
            </div>
          </div>
        ))}
        isOrdered={orderedList}
      />
      <AddButton
        onClick={() => {
          increaseCount();
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
