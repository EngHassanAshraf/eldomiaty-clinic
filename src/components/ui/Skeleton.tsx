export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}
