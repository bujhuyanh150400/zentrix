export type TransactionType = "withdraw"; // Hiện tại chỉ có rút tiền

export type TransactionStatus = "success" | "pending" | "failed";

export interface WalletTransaction {
    id: number;
    amount: number;
    type: TransactionType;
    createdAt: string;
    status: TransactionStatus;
    description: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    transactionCode: string;
    fee: number;
    failReason?: string;
}

export interface WalletData {
    balance: number; // Số dư hiện tại
    transactions: WalletTransaction[];
}

// Response từ API
export interface WalletApiResponse {
    success: boolean;
    data: WalletData;
    message?: string;
}
