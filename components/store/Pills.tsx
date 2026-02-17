import { glassStyles } from "@/components/ui/glass";

type ProductConditionValue = "NEW" | "UK_USED" | "NG_USED";
type ProductStatusValue = "PUBLISHED" | "DRAFT" | "ARCHIVED";
type DealTypeValue = "NONE" | "CHEAP_DEAL" | "HOT_SALE" | "CLEARANCE";

export function ConditionPill({ condition }: { condition: ProductConditionValue | string | null | undefined }) {
  const label = condition === "NEW" ? "NEW" : condition === "UK_USED" ? "UK USED" : condition === "NG_USED" ? "NG USED" : "NEW";

  return <span className={glassStyles.pill}>{label}</span>;
}

export function DealPill({ dealType }: { dealType: DealTypeValue | string | null | undefined }) {
  if (!dealType || dealType === "NONE") {
    return null;
  }

  const label =
    dealType === "HOT_SALE"
      ? "HOT SALE"
      : dealType === "CHEAP_DEAL"
      ? "CHEAP DEAL"
      : "CLEARANCE";

  return <span className={`${glassStyles.pill} border-white/35 bg-white/[0.08]`}>{label}</span>;
}

export function StatusPill({ status }: { status: ProductStatusValue | string | null | undefined }) {
  const label = status === "PUBLISHED" ? "PUBLISHED" : status === "DRAFT" ? "DRAFT" : "ARCHIVED";
  return <span className={glassStyles.pill}>{label}</span>;
}

export function DiscountPill({ percent }: { percent: number }) {
  if (percent <= 0) {
    return null;
  }

  return <span className={`${glassStyles.pill} border-white/35 bg-white/[0.08]`}>-{percent}%</span>;
}
