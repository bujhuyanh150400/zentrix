import {Symbol} from "@/services/assest_trading/@types";

/**
 * Time frame types
 */
export enum _Timeframe {
    OneMinute = '1min',
    FiveMinute = '5min',
    FifteenMinutes = '15min',
    ThirtyMinutes = '30min',
    FortyFiveMinutes = '45min',
    OneHour = '1h',
    OneDay = '1day',
    OneWeek = '1week',
}
export enum _TypeChart {
    CANDLE = "CANDLE",
    LINE = "LINE",
}

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
    "rate_to_usd": number,
    "level": number | null,
    "entry_price_convert": number,
    "close_price_convert" : number | null,
    "fee": number,
    "fee_overnight": number,
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
    real_time_profit?: number;
    realtime_price?: number;
    entry_volume_price?: number;
    realtime_volume_price?: number;
}

export const TIME_FRAME_SELECT = [
    {label: '1 phút', unit: "1m", value: _Timeframe.OneMinute},
    {label: '5 phút', unit: "5m", value: _Timeframe.FiveMinute},
    {label: '30 phút', unit: "30m", value: _Timeframe.ThirtyMinutes},
    {label: '45 phút', unit: "45m", value: _Timeframe.FortyFiveMinutes},
    {label: '1 giờ', unit: "1h", value: _Timeframe.OneHour},
    {label: '1 ngày', unit: "1d", value: _Timeframe.OneDay},
    {label: '1 tuần', unit: "1w", value: _Timeframe.OneWeek},
];
