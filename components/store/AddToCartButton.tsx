"use client";

import { ReactNode, useState } from "react";
import { useCart } from "@/components/ui/CartContextProvider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  className,
  label = "Add to cart",
  pendingLabel = "Adding...",
  icon,
}: {
  productId: string;
  className?: string;
  label?: string;
  pendingLabel?: string;
  icon?: ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={async () => {
        setPending(true);
        await addItem(productId, 1);
        setPending(false);
      }}
      disabled={pending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-2 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-black disabled:opacity-60",
        className
      )}
      aria-label="Add to cart"
    >
      {pending ? (
        pendingLabel
      ) : (
        <span className="inline-flex items-center gap-1.5">
          {icon}
         <p className="hidden md:block"> {label}</p>
        </span>
      )}
    </button>
  );
}
