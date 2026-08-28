/** Minimum order value, net of VAT (EUR). */
export const MIN_ORDER_NET = 300;

export function meetsMinOrder(net: number): boolean {
  return net + 1e-9 >= MIN_ORDER_NET;
}

/** ETA counts only when it includes a year (Excel “30.9” is not an arrival date). */
export function hasArrivalDate(eta: string | null | undefined): boolean {
  if (!eta) return false;
  return /\d{4}/.test(String(eta));
}
