const fcfa = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 10000 → "10 000 FCFA" (narrow no-break spaces, never wraps). */
export function formatFCFA(amount: number): string {
  return `${fcfa.format(amount)} FCFA`;
}

/** 10000 → "10 000" */
export function formatAmount(amount: number): string {
  return fcfa.format(amount);
}
