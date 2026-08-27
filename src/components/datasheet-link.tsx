import { FileText } from "lucide-react";
import { datasheetDownloadName } from "@/lib/catalog-helpers";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";

export function DatasheetLink({
  product,
  compact = false,
  className,
}: {
  product: Product;
  compact?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  if (!product.datasheetUrl) return null;
  const filename = datasheetDownloadName(product);
  return (
    <a
      href={product.datasheetUrl}
      download={filename}
      type="application/pdf"
      title={filename}
      aria-label={t("product.datasheet")}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 border border-line bg-surface font-medium text-ink hover:bg-paper",
        compact ? "size-9 rounded-md" : "h-11 rounded-lg px-4 text-sm",
        className,
      )}
    >
      <FileText className="size-4 shrink-0" />
      {compact ? null : t("product.datasheet")}
    </a>
  );
}
