import {create} from "zustand";


export interface IUseAppStore {
    loading: boolean;
    setLoading: (state: boolean) => void;
}

export const useAppStore = create<IUseAppStore>((set, get) => ({
    loading: false,
    setLoading: (state: boolean) => {
        set({loading: state});
    }
}));

