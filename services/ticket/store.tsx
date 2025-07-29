import {FormSupportStepOne} from "@/services/ticket/@types";
import {create} from "zustand";

interface IFormSupportStore {
    form_step_1: FormSupportStepOne | null,
    setStepOne: (data: FormSupportStepOne) => void,
    clearStepOne: () => void,
}

export const formSupportStore = create<IFormSupportStore>((set,get) => ({
    form_step_1: null,
    setStepOne: (data) => set({form_step_1: data}),
    clearStepOne: () => set({form_step_1: null}),
}));