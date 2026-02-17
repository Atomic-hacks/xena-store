import { formatCurrencyFromCents } from "@/lib/pricing";

export function Currency({ cents }: { cents: number }) {
  return <>{formatCurrencyFromCents(cents)}</>;
}
