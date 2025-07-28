import secureStorage from "@/libs/storage/secureStorage";
import {_AuthStatus, LoginResponse, UserLogin} from "@/services/auth/@type";
import {SECURE_AUTH_TOKEN, SECURE_PIN_CODE} from "@/libs/storage/key";
import {create} from 'zustand';

export interface IAuthState {
    status: _AuthStatus;
    auth_data: LoginResponse | null;
    pin_code: string | null;
    setAuthData: (data: LoginResponse) => void;
    login: (data: string) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
    verify: (data: UserLogin) => Promise<boolean>;
    unVerify: () => void;
}

const useAuthStore = create<IAuthState>((set, get) => ({
    status: _AuthStatus.UNAUTHORIZED,
    auth_data: null,
    pin_code: null,
    setAuthData: (data: LoginResponse) => {
        set({auth_data: data});
    },
    login: async (pinData) => {
        const {auth_data} = get();
        if (!auth_data) {
            throw new Error('Login data is not set');
        }
        await secureStorage.setItem<string>(SECURE_PIN_CODE, pinData);
        await secureStorage.setItem<LoginResponse>(SECURE_AUTH_TOKEN, auth_data)
        set({status: _AuthStatus.AUTHORIZED, auth_data: auth_data});
    },
    logout: async () => {
        await secureStorage.removeItem(SECURE_PIN_CODE)
        await secureStorage.removeItem(SECURE_AUTH_TOKEN)
        set({
            status: _AuthStatus.UNAUTHORIZED,
            auth_data: null,
            pin_code: null
        });
    },
    hydrate: async () => {
        const authData = await secureStorage.getItem<LoginResponse>(SECURE_AUTH_TOKEN);
        const pinData = await secureStorage.getItem<string>(SECURE_PIN_CODE);
        if (authData && pinData) {
            set({
                status: _AuthStatus.NEED_ACCESS_PIN,
                auth_data: authData,
                pin_code: pinData
            });
        } else {
            set({
                status: _AuthStatus.UNAUTHORIZED,
                auth_data: null,
                pin_code: null
            });
        }
    },

    verify: async (data: UserLogin) => {
        const authData = await secureStorage.getItem<LoginResponse>(SECURE_AUTH_TOKEN);
        if (authData){
            const auth_data = {token: authData.token, user: data}
            await secureStorage.setItem<LoginResponse>(SECURE_AUTH_TOKEN, auth_data)
            set({status: _AuthStatus.AUTHORIZED, auth_data});
            return true;
        }else{
            set({
                status: _AuthStatus.UNAUTHORIZED,
                auth_data: null,
                pin_code: null
            });
            return false;
        }
    },
    unVerify: () => {
        set({status: _AuthStatus.NEED_ACCESS_PIN})
    }
}));
export default useAuthStore
