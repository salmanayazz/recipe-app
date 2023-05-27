interface UnorderedListProps {
    values?: string[] | JSX.Element[]
}

export default function UnorderedList({
    values,
}: UnorderedListProps) {

    return (
        <ul>
            {values?.map((value, index) => (
                <li
                    key={index} 
                    className="flex"
                >
                    <div>
                        •
                    </div>
                    <div>
                        {value}
                    </div>
                </li>
            ))}
        </ul>
    );
}