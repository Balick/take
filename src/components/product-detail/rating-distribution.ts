export interface RatingBucket {
  stars: number;
  count: number;
  percent: number;
}

/** Share of reviews pinned to 1 star, to get the J-shape real stores show. */
const ONE_STAR_SHARE = 0.02;

/**
 * Builds a plausible 5→1 star breakdown whose average matches `rating`.
 *
 * The demo catalog only stores an average and a count, so we model the
 * distribution as a geometric curve (each star level is `t` times more common
 * than the one below) plus a small share of 1-star reviews, and solve for `t`.
 * Replace this with real numbers when your backend provides them.
 */
export function getRatingDistribution(rating: number, total: number): RatingBucket[] {
  const stars = [1, 2, 3, 4, 5];

  const geometric = (t: number) => stars.map((_, index) => t ** index);
  const meanOf = (weights: number[]) => {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.reduce((acc, weight, index) => acc + weight * stars[index], 0) / sum;
  };

  // Mean the geometric part must have so the blended mean equals `rating`.
  const target = Math.min(
    4.97,
    Math.max(1.03, (rating - ONE_STAR_SHARE) / (1 - ONE_STAR_SHARE)),
  );

  // The mean grows monotonically with `t`: bisect on a log scale.
  let low = 1e-3;
  let high = 1e3;
  for (let i = 0; i < 60; i++) {
    const mid = Math.sqrt(low * high);
    if (meanOf(geometric(mid)) < target) low = mid;
    else high = mid;
  }

  const weights = geometric(Math.sqrt(low * high));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const shares = weights.map(
    (weight, index) =>
      (weight / weightSum) * (1 - ONE_STAR_SHARE) + (index === 0 ? ONE_STAR_SHARE : 0),
  );

  // Largest-remainder rounding so the counts add up to `total` exactly.
  const raw = shares.map((share) => share * total);
  const counts = raw.map(Math.floor);
  let remaining = total - counts.reduce((a, b) => a + b, 0);
  const byRemainder = raw
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);
  for (const { index } of byRemainder) {
    if (remaining <= 0) break;
    counts[index] += 1;
    remaining -= 1;
  }

  return stars
    .map((star, index) => ({
      stars: star,
      count: counts[index],
      percent: total > 0 ? Math.round((counts[index] / total) * 100) : 0,
    }))
    .reverse();
}
