import { parseToNumber } from "@/libs/utils";
import { Account } from "@/services/account/@types";
import { useConfigApp } from "@/services/app/hook";
import { Symbol } from "@/services/assest_trading/@types";
import {
  useGetPriceConvertUsd,
  useSubscribeSymbols,
} from "@/services/assest_trading/hook";
import { useSubscribeSymbolStore } from "@/services/assest_trading/store";
import { useAuthStore } from "@/services/auth/store";
import { _ConfigKey } from "@/services/common/@types";
import {
  _TransactionStatus,
  _TypeTrading,
  CalculateTransactionPrices,
  StoreTransactionRequestType,
  Transaction,
  TransactionCancelRequestType,
  TransactionClosedRequestType,
  TransactionHistoryRequestType,
  TransactionOpenNowRequestType,
} from "@/services/transaction/@types";
import transactionAPI from "@/services/transaction/api";
import {
  useTransactionHistoryStore,
  useTransactionStore,
} from "@/services/transaction/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export const useTransactionHistory = (
  params: TransactionHistoryRequestType
) => {
  const query = useQuery({
    queryKey: ["transactionAPI-history", params],
    enabled: !!params.account_id,
    queryFn: async () => await transactionAPI.history(params),
    select: (res) => res.data,
  });
  const { data, setTransactions } = useTransactionHistoryStore();

  useEffect(() => {
    if (query.data) {
      setTransactions(params.status, query.data);
    }
  }, [query.data]);

  return {
    query,
    transactions: data,
  };
};

export const useTransactionTotal = (account_id: number | null) => {
  const query = useQuery({
    queryKey: ["transactionAPI-total", account_id],
    enabled: false,
    queryFn: async () => {
      return await transactionAPI.total({
        account_id: account_id || 0,
      });
    },
    select: (res) => res.data,
  });

  const { setTotal, total } = useTransactionStore();

  useEffect(() => {
    if (query.data) {
      setTotal(query.data);
    }
  }, [query.data]);

  return {
    query,
    total,
  };
};

const calculatePnL = (transaction: Transaction, closePrice: number) => {
  const {
    entry_price,
    volume,
    level,
    type,
    fee = 0,
    fee_overnight = 0,
    rate_to_usd = 1,
  } = transaction;

  if (!entry_price || entry_price <= 0 || !closePrice) {
    return {
      profit: 0,
      close_price_convert: 0,
    };
  }

  // BUY: (close - entry)
  // SELL: (entry - close)
  const priceDiff =
    type === 0 ? closePrice - entry_price : entry_price - closePrice;

  const grossProfit = priceDiff * volume * level * rate_to_usd;

  const netProfit = grossProfit - fee - fee_overnight;

  return {
    profit: netProfit,
    close_price_convert: closePrice * volume,
  };
};

export const useCalculateTransactionPrices = (
  transactions: Transaction[],
  enable: boolean
) => {
  const authData = useAuthStore((s) => s.auth_data);

  const listSymbol = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.map((t) => t.symbol.symbol);
  }, [transactions]);

  useSubscribeSymbols(
    listSymbol,
    authData?.user?.id,
    authData?.user?.secret,
    enable
  );

  const prices = useSubscribeSymbolStore((s) => s.prices);

  return useMemo(() => {
    if (!enable) {
      return { total: 0, data: [] as CalculateTransactionPrices[] };
    }

    return transactions.reduce(
      (acc, item) => {
        // ❌ Bỏ qua lệnh lỗi
        if (!item.entry_price || item.entry_price <= 0) return acc;

        const symbolPrice = prices[item.symbol.symbol];

        // ===== OPEN / WAITING =====
        if (
          symbolPrice &&
          (item.status === _TransactionStatus.OPEN ||
            item.status === _TransactionStatus.WAITING)
        ) {
          if (item.status === _TransactionStatus.OPEN) {
            const calc = calculatePnL(item, symbolPrice.price);

            acc.total += calc.profit;

            acc.data.push({
              ...item,
              profit: calc.profit,
              realtime_price: symbolPrice.price,
              realtime_volume_price: calc.close_price_convert,
            });
          }

          if (item.status === _TransactionStatus.WAITING) {
            acc.data.push({
              ...item,
              realtime_price: symbolPrice.price,
              profit: 0,
            });
          }
        }

        // ===== CLOSED =====
        if (item.status === _TransactionStatus.CLOSED && item.close_price) {
          const calc = calculatePnL(item, item.close_price);

          acc.data.push({
            ...item,
            profit: calc.profit,
            realtime_volume_price: calc.close_price_convert,
          });
        }

        return acc;
      },
      {
        total: 0,
        data: [] as CalculateTransactionPrices[],
      }
    );
  }, [transactions, prices, enable]);
};

export const useMutationCloseTrans = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => Promise<void>;
  onError: (error: any) => void;
}) =>
  useMutation({
    mutationFn: (data: TransactionClosedRequestType) =>
      transactionAPI.closed(data),
    onSuccess,
    onError,
  });

export const useMutationOpenNowTrans = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => Promise<void>;
  onError: (error: any) => void;
}) =>
  useMutation({
    mutationFn: (data: TransactionOpenNowRequestType) =>
      transactionAPI.openNow(data),
    onSuccess,
    onError,
  });

export const useMutationCanceledTrans = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => Promise<void>;
  onError: (error: any) => void;
}) =>
  useMutation({
    mutationFn: (data: TransactionCancelRequestType) =>
      transactionAPI.cancel(data),
    onSuccess,
    onError,
  });

export const useMutationStoreTrans = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => Promise<void>;
  onError: (error: any) => void;
}) =>
  useMutation({
    mutationFn: (data: StoreTransactionRequestType) =>
      transactionAPI.store(data),
    onSuccess,
    onError,
  });

export const useCalculateInfoTrading = (
  realTimePrice: number,
  volume: number,
  account: Account | null,
  type_trading: _TypeTrading,
  symbol?: Symbol
) => {
  const { config, getConfig } = useConfigApp();

  // phí
  const configFee = useMemo(() => {
    const trans_fee = Number(getConfig(_ConfigKey.TRANSACTION_FEE)?.value) || 1;
    const trans_fee_overnight =
      Number(getConfig(_ConfigKey.TRANSACTION_FEE_OVERNIGHT)?.value) || 1;
    return {
      trans_fee: trans_fee / 100,
      trans_fee_overnight: trans_fee_overnight / 100,
    };
  }, [config]);

  // Giá chuyển đổi sang USD
  const quoteCurrency = useMemo(() => {
    if (symbol) {
      const split = symbol.symbol.split("/");
      let quoteCurrency = split[1];
      if (!quoteCurrency) {
        quoteCurrency = split[0];
      }
      return quoteCurrency.toUpperCase();
    }
    return null;
  }, [symbol]);

  const rateToUsd = useGetPriceConvertUsd(quoteCurrency || "");

  // Ký quỹ = (Volume × Giá) / Đòn bẩy
  const deposit = useMemo(() => {
    const level = account?.lever;
    if (level) {
      let leverMax = 1;
      if (level.max !== null) {
        leverMax = parseToNumber(level.max);
        if (type_trading === _TypeTrading.VOL) {
          return (realTimePrice * volume) / leverMax;
        } else {
          return (realTimePrice * rateToUsd) / leverMax;
        }
      }
    }
    return 0;
  }, [account?.lever, realTimePrice, volume, type_trading, rateToUsd]);

  const priceConvert = useMemo(() => {
    let priceVolume = realTimePrice;
    if (type_trading === _TypeTrading.VOL) {
      priceVolume = priceVolume * volume;
    } else {
      priceVolume = priceVolume * rateToUsd;
    }
    const fee = configFee.trans_fee * priceVolume;
    // giá tổng là giá + thêm phí giao dịch, phí qua đêm sẽ trừ trên server
    const totalPrice = priceVolume + fee;

    // gía convert sang usd
    const convertPrice =
      type_trading === _TypeTrading.VOL ? totalPrice * rateToUsd : totalPrice;

    return {
      totalPrice,
      convertPrice,
    };
  }, [rateToUsd, realTimePrice, volume, configFee, type_trading]);

  return {
    trans_fee: configFee.trans_fee * (volume * realTimePrice),
    trans_fee_overnight:
      configFee.trans_fee_overnight * (volume * realTimePrice),
    deposit,
    rateToUsd,
    priceConvert,
    account,
  };
};
