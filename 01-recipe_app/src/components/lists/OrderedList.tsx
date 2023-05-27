interface OrderedListProps {
    values?: string[]
}

export default function OrderedList({
    values,
}: OrderedListProps) {

    return (
        <ol>
            {values?.map((value, index) => (
                <li
                    key={index}
                >
                    {`${index + 1}. ${value}`}
                </li>
            ))}
        </ol>
    );
}