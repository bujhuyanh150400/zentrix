import useAuthStore from "@/services/auth/store";
import {useEffect} from "react";
import {_AuthStatus} from "@/services/auth/@type";
import {router} from "expo-router";
import {SafeAreaProvider} from 'react-native-safe-area-context';


export default function AuthLayout() {
    const status = useAuthStore(s => s.status);

    useEffect(() => {
        if (status === _AuthStatus.AUTHORIZED) {
            router.replace('/(app)/(tab)');
        }
    }, [status]);

    return (
        <SafeAreaProvider>

        </SafeAreaProvider>
    )
}