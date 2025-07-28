import useAuthStore, {IAuthState} from "@/services/auth/store";
import {_AuthStatus} from "@/services/auth/@type";
import {router} from "expo-router";


export const checkLogin = async (hydrate: IAuthState['hydrate']) => {
    await hydrate()
    const freshStatus = useAuthStore.getState().status
    if (freshStatus === _AuthStatus.NEED_ACCESS_PIN) {
        router.replace('/(auth)/verify');
    } else {
        router.replace('/(auth)');
    }
};