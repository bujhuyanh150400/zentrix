import {Symbol} from "@/services/assest_trading/@types";

export enum _TransactionStatus {
    OPEN = 1,
    CLOSED = 2,
    WAITING = 3,
}
export enum _TradeType {
    BUY = 0,
    SELL = 1,
}
export enum _TransactionTriggerType {
    TYPE_TRIGGER_NOW = 1,
    TYPE_TRIGGER_AUTO_TRIGGER = 2,
    TYPE_TRIGGER_LOW_BUY = 3,
    TYPE_TRIGGER_HIGH_BUY = 4
}


export type StoreTransactionRequestType = {
    account_id: number;
    asset_trading_id: number;
    type: _TradeType;
    type_trigger: _TransactionTriggerType,
    volume: string;
    entry_price: string;
    trigger_price?: string;
    percent_take_profit?: string;
    percent_stop_loss?: string;
}

export type TotalTransactionRequestType = {
    account_id: number;
}

export type StoreTransactionResponseType = {
    "message": string,
    "data": {
        "open": number,
        "waiting": number,
        "close": number
    }
}

export type Transaction = {
    "id": number,
    "type": _TradeType,
    "volume": number,
    "code": string,
    "type_trigger": _TransactionTriggerType,
    "entry_price": number,
    "close_price": number | null,
    "trigger_price": number | null,
    "take_profit": number | null,
    "stop_loss": number | null,
    "status": _TransactionStatus,
    "open_at": string | null, // ISO 8601 format
    "trigger_at": string | null, // ISO 8601 format
    "close_at": string | null, // ISO 8601 format
    symbol: Symbol
}

export type TransactionHistoryRequestType = {
    account_id: number;
    status: _TransactionStatus;
}

export type TransactionHistoryResponseType = {
    message: string,
    data: Transaction[]
}

export type TransactionClosedRequestType = {
    transaction_id: number;
    close_price: number;
}

export type TransactionOpenNowRequestType = {
    transaction_id: number;
    entry_price: number;
}

export type TransactionCancelRequestType = {
    transaction_id: number;
}

export type CalculateTransactionPrices = Transaction & {
    profit?: number;
    realtime_price?: number;
    entry_volume_price?: number;
    realtime_volume_price?: number;
}