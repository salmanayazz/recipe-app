interface Header2Props {
    text: string
}


export default function Header2 ({
    text
}: Header2Props) {

    return (
        <h2
            className="text-sec-200 text-2xl font-bold h-fit w-fit"
        >
            {text}
        </h2>
    )
}