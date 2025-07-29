import {
    _TransactionStatus,
    CalculateTransactionPrices, StoreTransactionRequestType,
    Transaction, TransactionCancelRequestType, TransactionClosedRequestType,
    TransactionHistoryRequestType, TransactionOpenNowRequestType
} from "@/services/transaction/@types";
import {useMutation, useQuery} from "@tanstack/react-query";
import transactionAPI from "@/services/transaction/api";
import {useTransactionHistoryStore, useTransactionStore} from "@/services/transaction/store";
import {useEffect, useMemo} from "react";
import {useAuthStore} from "@/services/auth/store";
import {useSubscribeSymbols} from "@/services/assest_trading/hook";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";


export const useTransactionHistory = (params: TransactionHistoryRequestType) => {
    const query = useQuery({
        queryKey: ['transactionAPI-history', params],
        enabled: !!params.account_id,
        queryFn: async () => await transactionAPI.history(params),
        select: (res) => res.data,
    });
    const {data, setTransactions} = useTransactionHistoryStore();
    useEffect(() => {
        if (query.data) {
            setTransactions(params.status, query.data);
        }
    }, [params.status, query.data, setTransactions]);

    return {
        query,
        transactions: data,
    };
}

export const useTransactionTotal = (account_id: number | null) => {
    const query =  useQuery({
        queryKey: ['transactionAPI-total', account_id],
        enabled: false,
        queryFn: async () => {
            return await transactionAPI.total({
                account_id: account_id || 0,
            });
        },
        select: (res) => res.data
    });
    const {setTotal,total} = useTransactionStore();

    useEffect(() => {
        if (query.data) {
            setTotal(query.data);
        }
    }, [query.data, setTotal]);
    return {
        query,
        total
    };
};

export const useCalculateTransactionPrices = (transaction: Transaction[], enable: boolean) => {

    const authData = useAuthStore(s => s.auth_data);

    const listSymbol = useMemo(() => {
        return (transaction && Array.isArray(transaction) && transaction.length > 0) ? transaction.map(item => item.symbol.symbol) : [] as string[];
    }, [transaction]);

    useSubscribeSymbols(listSymbol,authData?.user?.id,authData?.user?.secret, enable);

    const prices = useSubscribeSymbolStore((s) => s.prices);

    return useMemo(() => {
        return transaction.reduce((acc, item) => {
            const symbolPrice = prices[item.symbol.symbol];
            if (symbolPrice && (item.status === _TransactionStatus.OPEN || item.status === _TransactionStatus.WAITING)) {
                const entryVolumePrice = item.entry_price * item.volume;
                const realtimeVolumePrice = symbolPrice.price * item.volume;
                if (item.status === _TransactionStatus.OPEN){
                    const profit = (realtimeVolumePrice - entryVolumePrice);
                    acc.total += profit;
                    acc.data.push({
                        ...item,
                        profit: profit,
                        realtime_price: symbolPrice.price,
                        entry_volume_price: entryVolumePrice,
                        realtime_volume_price: realtimeVolumePrice,
                    });
                }
                if (item.status === _TransactionStatus.WAITING) {
                    acc.data.push({
                        ...item,
                        realtime_price: symbolPrice.price,
                    });
                }
            }else if (item.status === _TransactionStatus.CLOSED && item.close_price) {
                const entryVolumePrice = item.entry_price * item.volume;
                const closedVolumePrice = item.close_price * item.volume;
                const profit = (closedVolumePrice - entryVolumePrice);
                acc.data.push({
                    ...item,
                    profit: profit,
                });
            }
            return acc;
        }, {
            total: 0,
            data: [] as CalculateTransactionPrices[]
        })
    },[prices, transaction])


}

export const useMutationCloseTrans = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: TransactionClosedRequestType) => transactionAPI.closed(data),
    onSuccess,
    onError,
})

export const useMutationOpenNowTrans = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: TransactionOpenNowRequestType) => transactionAPI.openNow(data),
    onSuccess,
    onError,
})

export const useMutationCanceledTrans = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: TransactionCancelRequestType) => transactionAPI.cancel(data),
    onSuccess,
    onError,
})

export const useMutationStoreTrans = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: StoreTransactionRequestType) => transactionAPI.store(data),
    onSuccess,
    onError,
})