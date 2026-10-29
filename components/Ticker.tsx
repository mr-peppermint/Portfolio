const ITEMS = [
  "Full-Stack",
  "React",
  "Next.js",
  "Python",
  "WebGL",
  "Vibe Coding",
  "Linux",
  "Optimize",
];

export default function Ticker() {
  const group = (key: string) => (
    <div className="ticker-group" key={key}>
      {ITEMS.map((item) => (
        <span key={item}>
          {item}
          <i />
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {group("a")}
        {group("b")}
        {group("c")}
        {group("d")}
      </div>
    </div>
  );
}
