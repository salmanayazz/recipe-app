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
                className="flex gap-2 w-full ml-2 text-sec-200"
            >
                
                <div>
                    {isOrdered ? (`${index + 1}.`) : ('●')}
                </div>

                <div
                    className="flex items-center w-full"
                >
                    {value}
                </div>
            </li>
        ));
    }

    return (
        <>
            {isOrdered ? (
                <ol
                    className="flex flex-col gap-1"
                >
                    {renderValues()}
                </ol>
            ) : (
                <ul
                className="flex flex-col gap-1"
                >
                    {renderValues()}
                </ul>
            )}
        </>
    );
}