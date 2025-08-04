import {create} from "zustand";
import {_ConfigKey, Config} from "@/services/common/@types";


export interface IUseAppStore {
    loading: boolean;
    config: Config[];
    setConfig: (data: Config[]) => void;
    getConfig: (key: _ConfigKey) => Config | null;
    setLoading: (state: boolean) => void;
}

export const useAppStore = create<IUseAppStore>((set, get) => ({
    loading: false,
    config: [],
    setConfig: (data) => set({config: data}),
    getConfig: (key) => {
        const { config } = get();
        return config.find((item) => item.key === key) || null;
    },
    setLoading: (state: boolean) => {
        set({loading: state});
    }
}));

