import {useQuery} from "@tanstack/react-query";
import tradeAPI from "@/services/trade/api";
import {TWPriceRequest} from "@/services/trade/@types";
import {useMemo} from "react";


export const useQueryGetTWPrice = (params: TWPriceRequest) => useQuery({
    queryKey: ['tradeAPI-tw_price', params],
    queryFn: async () => tradeAPI.tw_price(params),
    select:(res) => res.price
})

export const useGetTWPrice = (symbol: string) => {
    const query = useQueryGetTWPrice({symbol: symbol});

    return {
        loading: query.isLoading || query.isRefetching,
        money: useMemo(() => query.data ? Number(query.data).toFixed(2) : (0).toFixed(2),[query.data])
    }
}

