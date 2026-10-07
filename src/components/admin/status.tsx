import type { OrderStatus } from "@/server/db/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
  EXPIRED: "Expiré",
  REFUNDED: "Remboursé",
};

/** Colour backs up the text, never replaces it. */
const TONE: Record<OrderStatus, string> = {
  PAID: "border-[#1f6f3f]/30 bg-[#1f6f3f]/10 text-[#155230]",
  PENDING: "border-signal/40 bg-signal/12 text-[#7a4300]",
  FAILED: "border-[#b42318]/30 bg-[#b42318]/8 text-[#7a1a12]",
  CANCELLED: "border-ink/15 bg-stone text-smoke",
  EXPIRED: "border-ink/15 bg-stone text-smoke",
  REFUNDED: "border-ink/25 bg-paper text-ink",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center border px-2 py-0.5 text-[0.8125rem] font-medium whitespace-nowrap ${TONE[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
