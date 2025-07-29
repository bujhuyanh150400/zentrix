import {useContext, useEffect, useRef} from "react";
import {WebSocketContext} from "@/services/app/socketProvider";
import {useSubscribeSymbolStore} from "@/services/assest_trading/store";
import {_AssetType} from "@/services/assest_trading/@types";
import {useQuery} from "@tanstack/react-query";
import assetTradingAPI from "@/services/assest_trading/api";


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
    }, [ws, userId, secret, enable, symbols, setSubscribedSymbols]);


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
    }, [updatePrice, ws]);
}


export const useQueryListAssetTrading = (activeTab: _AssetType) => useQuery({
    queryKey: ['assetTradingAPI-list', activeTab],
    queryFn: async () => assetTradingAPI.list({type: activeTab}),
    enabled: false,
});