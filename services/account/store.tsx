import {Account} from "@/services/account/@types";
import {create} from "zustand";

interface IAddAccountStore {
    account: Account | null;
    setAccount: (account: Account) => void;

}

export const useAddAccountStore = create<IAddAccountStore>((set, get) => ({
    account: null,
    setAccount: (account: Account) => set({account: account})
}));