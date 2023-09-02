interface Header1Props {
    text: string
}


export default function Header1 ({
    text
}: Header1Props) {

    return (
        <h1
            className="text-sec-100 text-3xl font-bold h-fit w-fit my-2"
        >
            {text}
        </h1>
    )
}