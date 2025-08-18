export enum _WalletTransactionType {
    TYPE_WITHDRAW = 'withdraw',
    TYPE_AFF_COMMISSION = 'affiliate_commission',
}

export enum _WalletTransactionStatus {
    PENDING_STATUS = 0,
    APPROVED_STATUS = 1,
    REJECTED_STATUS = 2,
}

export type WalletTransaction = {
    id: number;
    user_id: number;
    type: _WalletTransactionType;
    money: number,
    status:_WalletTransactionStatus,
    note?:string,
    affiliate_commission_id?:number,
    bin_bank?:string,
    account_bank?:string,
    account_bank_name?:string,
    created_at: string

}


export type WithdrawTransactionWalletRequest = {
    money: number
}

export type ListWalletRequest = {
    page?: number;
}

export type ListWalletResponse = {
    data: WalletTransaction[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}