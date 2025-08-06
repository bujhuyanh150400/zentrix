import {useContext, useEffect, useMemo, useRef} from "react";
import {WebSocketContext} from "@/services/app/socketProvider";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";
import {
    _AssetType,
    AddFavoriteSymbolsRequest,
    DeletedFavoriteSymbolsRequest,
    SearchSymbolRequest
} from "@/services/assest_trading/@types";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import assetTradingAPI from "@/services/assest_trading/api";
import {parseToNumber} from "@/libs/utils";


export const useSubscribeSymbols = (symbols: string[], userId?: number, secret?: string, enable:boolean = true) => {
    const ws = useContext(WebSocketContext);
    const { updatePrice, setSubscribedSymbols } = useSubscribeSymbolStore();
    const mountedSymbols = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (!userId || !secret) return;
        symbols.filter(s => s.trim() !== "")
        const toSub = symbols.filter((s) => !mountedSymbols.current.has(s));
        const toUnsub = Array.from(mountedSymbols.current).filter((s) => !symbols.includes(s));
        // Gửi subscribe
        if (toSub.length > 0 && enable) {
            ws.send(
                JSON.stringify({
                    action: 'subscribe',
                    params: { user_id: userId, secret, symbols: toSub.join(',') },
                })
            );
        }
        // Gửi unsubscribe
        if (toUnsub.length > 0) {
            ws.send(
                JSON.stringify({
                    action: 'unsubscribe',
                    params: { user_id: userId, secret, symbols: toUnsub.join(',') },
                })
            );
        }
        mountedSymbols.current = new Set(symbols);
        setSubscribedSymbols(new Set(symbols));
    }, [ws, userId, secret, symbols.join(','), enable]);



    useEffect(() => {
        if (!ws) return;
        const handler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.symbol && data.price) {
                    updatePrice({
                        symbol: data.symbol,
                        timestamp: data.timestamp,
                        price: parseFloat(data.price),
                        percent: data.percent ?? null,
                    });
                }
            } catch (err) {
                console.log('Invalid message:', event.data);
            }
        };

        ws.addEventListener('message', handler);
        return () => {
            ws.removeEventListener('message', handler);
        };
    }, [ws]);
}

export const useQueryListAssetTrading = (activeTab: _AssetType) => useQuery({
    queryKey: ['assetTradingAPI-list', activeTab],
    queryFn: async () => assetTradingAPI.list({type: activeTab}),
    enabled: false,
});

export const useQueryFavoriteSymbolQuery = () => useQuery({
    queryKey: ['assetTradingAPI-getFavoriteSymbols'],
    queryFn: assetTradingAPI.getFavoriteSymbols,
});

export const useMutationDeletedFavoriteSymbol = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: DeletedFavoriteSymbolsRequest) => assetTradingAPI.deletedFavoriteSymbols(data),
    onSuccess,
    onError
});

export const useMutationAddFavoriteSymbol = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: AddFavoriteSymbolsRequest) => assetTradingAPI.addFavoriteSymbolsRequest(data),
    onSuccess,
    onError
});

export const useInfiniteSearchSymbol = (queryParams: SearchSymbolRequest = {}) => {
    return useInfiniteQuery({
        queryKey: ['assetTradingAPI-searchSymbol', queryParams],
        queryFn: ({pageParam = 1}) => {
            return assetTradingAPI.searchSymbol({
                ...queryParams,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
    });
};

export const useQueryItemSymbol= (symbol?:string) => useQuery({
    queryKey: ['assetTradingAPI-item', symbol],
    enabled: !!symbol,
    queryFn: async () => {
        return await assetTradingAPI.item({
            symbol: symbol || '',
        });
    },
    select: (res) => res.data
})


export const useGetPriceConvertUsd = (symbol: string) => {
    const query = useQuery({
        queryKey: ['assetTradingAPI-convertUsd', symbol],
        queryFn: async () => {
            return await assetTradingAPI.convertUsd({symbol});
        },
        select: (res) => res.price
    });
    return useMemo(() => query.data ? parseToNumber(query.data) : 0, [query.data]);
}
