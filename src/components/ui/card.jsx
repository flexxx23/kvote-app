export function Card({ children, className = "" }) {
  return <div className={`rounded-xl border bg-white p-4 shadow ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="pt-4">{children}</div>;
}
