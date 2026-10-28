import { portfolio } from "@/lib/content";

interface Props {
  /** Hero variant — label + arrow only. */
  compact?: boolean;
  className?: string;
  delay?: number;
  reveal?: boolean;
}

export default function Socials({ compact = false, className, delay, reveal }: Props) {
  return (
    <ul
      className={className}
      aria-label="Social links"
      data-reveal={reveal ? "" : undefined}
      style={delay != null ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {portfolio.socials.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noopener noreferrer">
            {compact ? (
              <>
                {s.label} <span aria-hidden="true">↗</span>
              </>
            ) : (
              <>
                <span className="social-short">{s.short || s.label.slice(0, 2)}</span>
                <span>{s.label}</span>
                <span className="social-arrow" aria-hidden="true">↗</span>
              </>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
