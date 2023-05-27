interface UnorderedListProps {
    values?: string[]
}

export default function UnorderedList({
    values,
}: UnorderedListProps) {

    return (
        <ul>
            {values?.map((value, index) => (
                <li
                    key={index} 
                >
                    {`• ${value}`}
                </li>
            ))}
        </ul>
    );
}