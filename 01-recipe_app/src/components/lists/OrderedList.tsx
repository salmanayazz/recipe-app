interface OrderedListProps {
    values?: string[] | JSX.Element[]
}

export default function OrderedList({
    values,
}: OrderedListProps) {

    return (
        <ol>
            {values?.map((value, index) => (
                <li
                    key={index} 
                    className="flex"
                >
                    <div>
                        {`${index + 1}.`}
                    </div>
                    <div>
                        {value}
                    </div>
                </li>
            ))}
        </ol>
    );
}