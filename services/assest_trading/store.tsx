import {SymbolPrice} from "@/services/assest_trading/@types";
import {create} from "zustand";


interface ISubscribeSymbolStore  {
    prices: Record<string, SymbolPrice>;
    subscribedSymbols: Set<string>;
    updatePrice: (data: SymbolPrice) => void;
    setSubscribedSymbols: (symbols: Set<string>) => void;
}

export const useSubscribeSymbolStore = create<ISubscribeSymbolStore>((set) => ({
    prices: {},
    subscribedSymbols: new Set(),
    updatePrice: (data) =>
        set((s) => ({
            prices: { ...s.prices, [data.symbol]: data },
        })),
    setSubscribedSymbols: (symbols) => set({ subscribedSymbols: new Set(symbols) }),
}));