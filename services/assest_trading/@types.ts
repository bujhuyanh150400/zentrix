export enum _AssetType {
    CRYPTO = 1,
    ENERGY = 2,
    METAL = 3,
    FAVORITE = 5,
}
export type Symbol = {
    'id': number,
    'symbol': string,
    'currency_base': string,
    'currency_quote': string| null,
    'spread': string, // float number
    'type': _AssetType
}

export type AssetTradingQueryParams = {
    type?: _AssetType;
    limit?: number
};

export type AssetTradingListResponse = {
    data: Symbol[];
    message:string;
};

export type AssetTradingItemParams = {
    symbol: string;
};
export type AssetTradingItemResponse = {
    data: Symbol;
    message:string;
};

export type SearchSymbolRequest = {
    keyword?:string;
    page?: number;
}

export type SearchSymbolResponse = {
    data: Symbol[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type getFavoriteSymbolsResponse = {
    data: Symbol[];
    message:string;
}

export type AddFavoriteSymbolsRequest = DeletedFavoriteSymbolsRequest

export type DeletedFavoriteSymbolsRequest = {
    asset_trading_id: number
}

export type SymbolPrice = {
    symbol: string;
    timestamp: number;
    price: number;
    percent: number | null;
};

export type ConvertUsdRequest = {
    symbol: string;
}

export type ConvertUsdResponse = {
    price: string;
}