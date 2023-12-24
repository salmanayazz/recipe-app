interface Header2Props {
  text: string;
}

export default function Header2({ text }: Header2Props) {
  return (
    <h2 className="text-sec-100 text-2xl font-bold h-fit w-fit my-2">{text}</h2>
  );
}
