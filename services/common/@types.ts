import {AccountType, CurrencyType, Lever} from "@/services/account/@types";
import {Bank} from "@/services/auth/@type";


export type AccountTypeListResponse = {
    data: AccountType[];
    message: string;
};
export type CurrencyResponse = {
    data: CurrencyType[];
    message: string;
};

export type LeverResponse = {
    data: Lever[];
    message: string;
};

export type ListBankResponse = {
    data: Bank[];
    message: string;
}
export type BankConfig = {
    "bank_name": string,
    "account_name": string,
    "account_number": string,
    "branch": string,
    "qr_code": string
}
export type BankConfigResponse = {
    data: BankConfig | null;
    message: string;
}

export enum _ConfigKey {
    TRANSACTION_FEE = 'TRANSACTION_FEE',
    TRANSACTION_FEE_OVERNIGHT = 'TRANSACTION_FEE_OVERNIGHT'
}

export type Config = {
    key: _ConfigKey;
    type: 'text' | 'number' | 'boolean';
    value: string,
    description: string | null,
}

export type ConfigResponse = {
    data: Config[];
    message: string;
}