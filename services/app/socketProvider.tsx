import {createContext, useEffect, useRef, ReactNode} from "react";
import {WS_URL} from "@/libs/constant_env";


export const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const wsRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;
        ws.onopen = () => console.log('WS connected ✅');
        ws.onclose = () => console.log('WS disconnected ❌');
        ws.onerror = (err) => console.log('WS error', err);

        return () => ws.close();
    }, []);

    return (
        <WebSocketContext.Provider value={wsRef.current}>
            {children}
        </WebSocketContext.Provider>
    );
};
