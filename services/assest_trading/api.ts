import {
    AddFavoriteSymbolsRequest,
    AssetTradingItemParams,
    AssetTradingItemResponse,
    AssetTradingListResponse,
    AssetTradingQueryParams,
    ConvertUsdRequest, ConvertUsdResponse,
    DeletedFavoriteSymbolsRequest,
    getFavoriteSymbolsResponse,
    SearchSymbolRequest,
    SearchSymbolResponse
} from "@/services/assest_trading/@types";
import {client} from "@/libs/client";
import {ResponseSuccessType} from "@/libs/@type";


const defaultURI = "/asset-trading";
const assetTradingAPI = {
    list: async (params: AssetTradingQueryParams): Promise<AssetTradingListResponse> => {
        const response = await client.get(`${defaultURI}/list`, {params});
        return response.data;
    },
    item: async (params: AssetTradingItemParams): Promise<AssetTradingItemResponse> => {
        const response = await client.get(`${defaultURI}/item`, {params});
        return response.data;
    },
    searchSymbol: async (params: SearchSymbolRequest): Promise<SearchSymbolResponse> => {
        const response = await client.get(`${defaultURI}/search-symbol`, {params});
        return response.data;
    },
    getFavoriteSymbols: async (): Promise<getFavoriteSymbolsResponse> => {
        const response = await client.get(`${defaultURI}/favorite-symbols`);
        return response.data;
    },
    addFavoriteSymbolsRequest: async (data: AddFavoriteSymbolsRequest): Promise<ResponseSuccessType> => {
        const response = await client.post(`${defaultURI}/favorite-symbols`, data);
        return response.data;
    },
    deletedFavoriteSymbols: async (data: DeletedFavoriteSymbolsRequest): Promise<ResponseSuccessType> => {
        const response = await client.delete(`${defaultURI}/favorite-symbols`, {data});
        return response.data;
    },
    convertUsd: async (params: ConvertUsdRequest): Promise<ConvertUsdResponse> => {
        const response = await client.get(`${defaultURI}/convert-usd-symbol`, {params});
        return response.data;
    },
}

export default assetTradingAPI;