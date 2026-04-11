/**
 * Pure utility — no JSX, safe to import in tests.
 */
export function computeSequence(target: number, steps = 50): number[] {
  const inc = target / steps;
  let cur = 0;
  const seq: number[] = [];
  for (let i = 0; i < steps; i++) {
    cur = Math.min(cur + inc, target);
    seq.push(Math.round(cur));
  }
  return seq;
}
