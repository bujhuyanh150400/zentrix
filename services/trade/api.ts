import {client} from "@/libs/client";
import {TimeSeriesRequest, TimeSeriesResponse, TWPriceRequest, TWPriceResponse} from "@/services/trade/@types";


const tradeAPI = {
    tw_price: async (params: TWPriceRequest): Promise<TWPriceResponse> => {
        const response = await client.get('/price', {params});
        return response.data;
    },
    timeSeries: async (params: TimeSeriesRequest): Promise<TimeSeriesResponse> => {
        const response = await client.get('/time_series', {params});
        return response.data;
    },
}
export default tradeAPI;