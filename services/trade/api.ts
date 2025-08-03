import {client} from "@/libs/client";
import {TWPriceRequest, TWPriceResponse} from "@/services/trade/@types";


const tradeAPI = {
    tw_price: async (params: TWPriceRequest): Promise<TWPriceResponse> => {
        const response = await client.get('/price', {params});
        return response.data;
    }
}
export default tradeAPI;