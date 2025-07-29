import secureStorage from "@/libs/storage/secureStorage";
import {_AuthStatus, FormVerifyAccountStepOne, LoginResponse, UserLogin} from "@/services/auth/@type";
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

export const useAuthStore = create<IAuthState>((set, get) => ({
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


export interface IForgotPassStorage {
    email: string | null,
    code: string | null,

    setEmail: (email: string) => void,
    setCode: (code: string) => void,
    setEmpty: () => void,
}

export const useForgotPassStore = create<IForgotPassStorage>((set, get) => ({
    email: null,
    code: null,
    setEmail: (email: string) => {
        set({email});
    },
    setCode: (code: string) => {
        set({code});
    },
    setEmpty: () => set({email: null, code: null}),
}));

interface IVerifyAccountUserStore {
    form_step_1: FormVerifyAccountStepOne | null,
    setStepOne: (data: FormVerifyAccountStepOne) => void,
    clearStepOne: () => void,
}

export const useVerifyAccountUserStore = create<IVerifyAccountUserStore>((set,get) => ({
    form_step_1: null,
    setStepOne: (data) => set({form_step_1: data}),
    clearStepOne: () => set({form_step_1: null}),
}));