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
    color?: string
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
export type CreateAccountRequest = {
    name: string;// tên tài khoản
    password: string; // mật khẩu tài khoản
    lever_id: number; // tỷ lệ đòn bẩy
    account_type_id: number; // id loại tài khoản
    account_type: _AccountType;  // loại tài khoản: REAL_ACCOUNT, CREDIT_ACCOUNT
};
export type AccountListResponse = {
    message: string;
    data: Account[];
};
export type AccountActiveResponse = {
    message: string;
    data: Account;
};
export type Account = {
    id: number;
    code: string;
    account_type_id: number;
    currency_id: number;
    lever_id: number;
    name: string;
    money: number;
    profit: number;
    type: _AccountType;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    account_type: AccountType; // Thông tin loại tài khoản
    currency: CurrencyType;
    lever: Lever
};
export type RechargeAccountRequest = {
    account_id: number; // id tài khoản
    money: number; // số tiền nạp vào tài khoản
}

export type UseGetAccountActiveHookType = {
    account: AccountActiveResponse['data'] | null;
    isSuccess: boolean;
    get: () => Promise<any>;
    loading: boolean;
    error: AxiosError | null;
};