const ITEMS = [
  "Interface engineering",
  "Motion systems",
  "Creative development",
  "Performance",
  "Available for select projects",
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
      </div>
    </div>
  );
}
