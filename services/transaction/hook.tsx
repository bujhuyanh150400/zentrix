import {
    _TransactionStatus,
    _TypeTrading,
    CalculateTransactionPrices,
    StoreTransactionRequestType,
    Transaction,
    TransactionCancelRequestType,
    TransactionClosedRequestType,
    TransactionHistoryRequestType,
    TransactionOpenNowRequestType
} from "@/services/transaction/@types";
import {useMutation, useQuery} from "@tanstack/react-query";
import transactionAPI from "@/services/transaction/api";
import {useTransactionHistoryStore, useTransactionStore} from "@/services/transaction/store";
import {useEffect, useMemo} from "react";
import {useAuthStore} from "@/services/auth/store";
import {useGetPriceConvertUsd, useSubscribeSymbols} from "@/services/assest_trading/hook";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";
import {useConfigApp} from "@/services/app/hook";
import {_ConfigKey} from "@/services/common/@types";
import {Account} from "@/services/account/@types";
import {Symbol} from "@/services/assest_trading/@types";
import {parseToNumber} from "@/libs/utils";
import {calculateCloseTransaction, calculateConvertPrice} from "@/services/transaction/helper";


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
    }, [query.data]);

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
    }, [query.data]);

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
                const entryPrice = calculateConvertPrice(item, symbolPrice.price);
                if (item.status === _TransactionStatus.OPEN){
                    const calculate = calculateCloseTransaction(item, symbolPrice.price);

                    acc.total += calculate.total;
                    acc.data.push({
                        ...item,
                        profit: calculate.total,
                        realtime_price: symbolPrice.price,
                        entry_volume_price: entryPrice,
                        realtime_volume_price: calculate.close_price_convert,
                    });
                }
                if (item.status === _TransactionStatus.WAITING) {
                    acc.data.push({
                        ...item,
                        realtime_price: symbolPrice.price,
                    });
                }
            }else if (item.status === _TransactionStatus.CLOSED && item.close_price) {
                const calculate = calculateCloseTransaction(item, item.close_price);
                acc.data.push({
                    ...item,
                    profit: calculate.total,
                    realtime_volume_price: calculate.close_price_convert,
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

export const useCalculateInfoTrading = (
    realTimePrice: number,
    volume: number,
    account: Account | null,
    type_trading: _TypeTrading,
    symbol?: Symbol,
) => {
    const {config, getConfig} = useConfigApp(); 

    // phí
    const configFee = useMemo(() => {
        const trans_fee = Number(getConfig(_ConfigKey.TRANSACTION_FEE)?.value) || 1
        const trans_fee_overnight = Number(getConfig(_ConfigKey.TRANSACTION_FEE_OVERNIGHT)?.value) || 1
        return {
            trans_fee: trans_fee / 100,
            trans_fee_overnight: trans_fee_overnight / 100
        }
    },[config]);

    // Giá chuyển đổi sang USD
    const quoteCurrency = useMemo(() => {
        if (symbol){
            const split = symbol.symbol.split("/");
            let quoteCurrency = split[1];
            if (!quoteCurrency) {
                quoteCurrency = split[0];
            }
            return quoteCurrency.toUpperCase();
        }
        return null;
    },[symbol])

    const rateToUsd = useGetPriceConvertUsd(quoteCurrency || '');

    // Ký quỹ = (Volume × Giá) / Đòn bẩy
    const deposit = useMemo(() => {
        const level = account?.lever;
        if (level){
            let leverMax = 1;
            if (level.max !== null) {
                leverMax = parseToNumber(level.max);
                if (type_trading === _TypeTrading.VOL){
                    return (realTimePrice * volume)/ leverMax;
                }else{
                    return (realTimePrice * rateToUsd)/ leverMax
                }
            }
        }
        return 0;
    },[account?.lever, realTimePrice, volume, type_trading, rateToUsd]);

    const priceConvert = useMemo(() => {
        let priceVolume = realTimePrice;
        if (type_trading === _TypeTrading.VOL){
            priceVolume = priceVolume * volume;
        }else{
            priceVolume = priceVolume * rateToUsd;
        }
        const fee = configFee.trans_fee * priceVolume;
        // giá tổng là giá + thêm phí giao dịch, phí qua đêm sẽ trừ trên server
        const totalPrice = priceVolume + fee;

        // gía convert sang usd
        const convertPrice = type_trading === _TypeTrading.VOL ? totalPrice * rateToUsd : totalPrice;

        return {
            totalPrice,
            convertPrice
        }
    }, [rateToUsd, realTimePrice, volume, configFee, type_trading]);


    return {
        trans_fee: configFee.trans_fee * (volume * realTimePrice),
        trans_fee_overnight: configFee.trans_fee_overnight * (volume * realTimePrice),
        deposit,
        rateToUsd,
        priceConvert,
        account
    }


}