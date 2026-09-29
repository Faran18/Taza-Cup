// Steps a quantity up/down while respecting a product's own minimum
// order quantity. Below the minimum there's no valid partial state
// (e.g. you can't order 3 of a 5-minimum custom cup), so decreasing
// snaps straight to zero once at the minimum, and increasing from
// zero snaps straight up to the minimum.
export function stepQuantity(current: number, direction: 1 | -1, minQuantity: number) {
  if (direction === 1) {
    return current === 0 ? minQuantity : current + 1;
  }
  return current - 1 <= minQuantity ? 0 : current - 1;
}
