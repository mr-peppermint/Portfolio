const ITEMS = [
  "Full-Stack Development",
  "React & Next.js",
  "Python & FastAPI",
  "WebGL & Particles",
  "Creative Coding",
  "Linux & Wayland",
  "High Performance",
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
