export default function SvgCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="5" cy="5" r="5" />
    </svg>
  );
}
