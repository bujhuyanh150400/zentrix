import {_TransactionStatus, StoreTransactionResponseType, Transaction} from "@/services/transaction/@types";
import {create} from "zustand";

interface TransactionHistoryStore {
    data: Record<_TransactionStatus, Transaction[]>;
    setTransactions: (status: _TransactionStatus, transactions: Transaction[]) => void;
}

export const useTransactionHistoryStore = create<TransactionHistoryStore>((set, get) => ({
    data: {
        [_TransactionStatus.OPEN]: [],
        [_TransactionStatus.CLOSED]: [],
        [_TransactionStatus.WAITING]: [],
    },
    setTransactions: (status, transactions) => {
        set((state) => ({
            data: {
                ...state.data,
                [status]: transactions,
            },
        }));
    },
}));


interface TransactionStore {
    total: StoreTransactionResponseType["data"] | null;
    setTotal: (data: StoreTransactionResponseType["data"]) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
    total: null,
    setTotal: (data) => set({ total: data }),
}));