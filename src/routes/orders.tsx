import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMyProfile } from "@/lib/auth/use-profile";
import { PendingNotice } from "./pending";
import { listMyOrders } from "@/lib/server/commerce";
import { formatEur } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const { user, isPending } = useCurrentUserState();
  const { isAwaiting } = useMyProfile();
  const { t, lang } = useI18n();
  const ordersQ = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: () => listMyOrders(),
    enabled: Boolean(user),
  });
  if (isPending) {
    return (
      <Shell>
        <p className="p-10 text-sm text-muted">{t("common.loading")}</p>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (isAwaiting) {
    return (
      <Shell>
        <PendingNotice />
      </Shell>
    );
  }
  const orders = ordersQ.data ?? [];
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-medium tracking-tight">{t("orders.title")}</h1>
        {orders.length === 0 ? (
          <p className="mt-8 text-sm text-muted">{t("orders.empty")}</p>
        ) : (
          <ul className="mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {orders.map((o) => (
              <li key={o.id}>
                <Link to="/orders/$id" params={{ id: String(o.id) }} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-paper">
                  <div>
                    <p className="font-medium">{o.orderNo}</p>
                    <p className="text-xs text-muted">
                      {o.createdAt.slice(0, 10)} · {t(`orders.status.${o.status}`)} · {o.items.length} {t("cart.lines", { n: o.items.length })}
                    </p>
                  </div>
                  <p className="tabular-nums">{formatEur(o.grandTotal, lang)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Shell>
  );
}
