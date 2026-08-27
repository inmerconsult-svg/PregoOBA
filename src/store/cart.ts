import { create } from "zustand";
import { persist } from "zustand/middleware";
import { roundToCarton } from "@/lib/utils";
import type { CartLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  add: (sku: string, qty: number, carton: number) => void;
  setQty: (sku: string, qty: number, carton: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (sku, qty, carton) => {
        const next = roundToCarton(qty, carton);
        const lines = [...get().lines];
        const i = lines.findIndex((l) => l.sku === sku);
        if (i >= 0) {
          lines[i] = { sku, qty: roundToCarton(lines[i].qty + next, carton) };
        } else {
          lines.push({ sku, qty: next });
        }
        set({ lines });
      },
      setQty: (sku, qty, carton) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.sku !== sku) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.sku === sku ? { sku, qty: roundToCarton(qty, carton) } : l)),
        });
      },
      remove: (sku) => set({ lines: get().lines.filter((l) => l.sku !== sku) }),
      clear: () => set({ lines: [] }),
    }),
    { name: "prego-cart" },
  ),
);
