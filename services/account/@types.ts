import {AxiosError} from "axios";

export type AccountType = {
    id: number; // id loại tài khoản
    name: string; // tên loại tài khoản
    description: string; // mô tả chi tiết về loại tài khoản
    summary: string; // mô tả ngắn gọn về loại tài khoản
    min: string; // số tiền tối thiểu để mở tài khoản
    max: string; // số tiền tối đa để mở tài khoản
    difference: string; // số tiền chênh lệch giữa các loại tài khoản
    commission: string; // hoa hồng giao dịch
    color?: string;
    max_withdraw_per_day?: number;
    max_withdraw_amount_per_day?: number;
};

export type CurrencyType = {
    id: number;
    country: string;
    currency: string;
    status: number;
    created_at: string;
    updated_at: string | null;
};

export type Lever = {
    id: number;
    min: number;
    max: string; // Có thể là số dạng chuỗi hoặc chuỗi đặc biệt như "Không giới hạn"
    type: string | null; // Có thể là chuỗi hoặc null
    check: any; // Nếu bạn biết chắc kiểu dữ liệu thì thay `any` cho cụ thể (ví dụ: boolean | null)
    status: boolean;
    created_at: string;
    updated_at: string | null;
};
/**
 * Account types
 */
export enum _AccountType {
    TEST_ACCOUNT = 0,
    REAL_ACCOUNT = 1,
}
export enum _AccountStatus {
    ACTIVE = 1,
    IN_ACTIVE = 2
}
export enum _AccountActiveProtectCost {
    ACTIVE = 1,
    IN_ACTIVE = 0
}
export type CreateAccountRequest = {
    name: string;// tên tài khoản
    password: string; // mật khẩu tài khoản
    lever_id: number; // tỷ lệ đòn bẩy
    account_type_id: number; // id loại tài khoản
    account_type: _AccountType;  // loại tài khoản: REAL_ACCOUNT, CREDIT_ACCOUNT
};

export type AccountActiveResponse = {
    message: string;
    data: Account;
};
export type Account = {
    id: number;
    code: string;
    account_type_id: number;
    lever_id: number;
    name: string;
    money: number;
    profit: number;
    type: _AccountType;
    status: _AccountStatus;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    active_protect_cost: _AccountActiveProtectCost
    account_type: AccountType;
    lever: Lever
};
export type RechargeAccountRequest = {
    account_id: number; // id tài khoản
    money: number; // số tiền nạp vào tài khoản
    transaction_code?: string // mã giao dịch, nếu là account real,
    amount_vnd?: number, // gía chuyển đổi
    bank_name?:string,
    bank_account_number?:string,
    bank_account_name?:string
}
export type RechargeAccountForm = Pick<RechargeAccountRequest, 'account_id' | 'money'>

export type EditLeverRequest = {
    account_id: number;
    lever_id:number
}
export type AccountIdRequest = {
    account_id: number;
}
export type ListHistoryRequest = {
    account_id: number;
    page?: number
}

export enum _HistoryType {
    RECHARGE = 0,
    WITHDRAW = 1,
}
export enum _HistoryStatus {
    STATUS_PROCESSING = 0,
    STATUS_DONE = 1,
    STATUS_UNAPPROVE = 2,
}

export type History = {
    "id": number,
    "transaction_code": string | null,
    "account_id": number,
    "price": string,
    "amount_vnd": string | null,
    "bank_name": string | null,
    "account_number": string | null,
    "account_name": string | null,
    "type": _HistoryType,
    "status": _HistoryStatus,
}

export type ListHistoryResponse = {
    data: History[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export enum _TypeSearch  {
    REAL = 'real',
    CREDIT = 'credit'
}
export type ListAccountRequest = {
    type: _TypeSearch;
    page?: number;
}
export type ListAccountResponse = {
    data: Account[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type UseGetAccountActiveHookType = {
    account: AccountActiveResponse['data'] | null;
    isSuccess: boolean;
    get: () => Promise<any>;
    loading: boolean;
    error: AxiosError | null;
};


export type WithdrawAccountRequest = {
    account_id: number; // id tài khoản
    money: number; // số tiền rút tài khoản
    transaction_code: string // mã giao dịch, nếu là account real,
    amount_vnd: number, // gía chuyển đổi
}

export type ActiveProtectAccountRequest = {
    account_id: number; // id tài khoản
}