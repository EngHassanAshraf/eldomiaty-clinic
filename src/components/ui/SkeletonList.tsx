import Skeleton from './Skeleton';

/**
 * Renders a list of Skeleton placeholders.
 * Replaces the repeated `Array.from({ length: N }).map((_, i) => <Skeleton key={i} ... />)` pattern.
 */
export default function SkeletonList({
  count,
  className = '',
}: {
  count: number;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </>
  );
}
