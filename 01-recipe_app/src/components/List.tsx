interface ListProps {
    values: string[] | JSX.Element[]
    isOrdered?: boolean
}

export default function List({
    values,
    isOrdered = false
}: ListProps) {

    function renderValues() {
        return values.map((value: string | JSX.Element, index: number) => (
            <li
                key={index} 
                className="flex"
            >
                <div>
                    {isOrdered ? (`${index + 1}.`) : (`•`)}
                </div>
                <div>
                    {value}
                </div>
            </li>
        ));
    }

    return (
        <>
            {isOrdered ? (
                <ol>
                    {renderValues()}
                </ol>
            ) : (
                <ul>
                    {renderValues()}
                </ul>
            )}
        </>
    );
}