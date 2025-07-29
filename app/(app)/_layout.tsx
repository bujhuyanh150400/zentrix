import {useAuthStore} from "@/services/auth/store";
import {useAppStore} from "@/services/app/store";
import {useEffect} from "react";
import {_AuthStatus} from "@/services/auth/@type";
import {router, Stack} from "expo-router";
import {WebSocketProvider} from "@/services/app/socketProvider";
import FullScreenLoading from "@/components/FullScreenLoading";
import DefaultColor from "@/components/ui/DefaultColor";


export default function AppLayout() {
    const status = useAuthStore(state => state.status);
    const loading = useAppStore(state => state.loading);

    useEffect(() => {
        if (status === _AuthStatus.UNAUTHORIZED) {
            router.replace('/(auth)')
        }
    }, [status]);

    return (
        <WebSocketProvider>
            <FullScreenLoading loading={loading} />
            <Stack
                initialRouteName="(tab)"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: DefaultColor.white },
                }}
            >
                <Stack.Screen name="(tab)"/>
                <Stack.Screen name="(account)"/>
                <Stack.Screen name="(info)"/>
                <Stack.Screen name="(trade)"/>
            </Stack>
        </WebSocketProvider>
    )
}