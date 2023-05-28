interface ParagraphProps {
    text: string;
}

export default function Paragraph({
    text
}: ParagraphProps) {

    return(
        <p
            className="text-sec-200 max-w-[100%] break-words" 
        >
            {text}
        </p>
    );
}