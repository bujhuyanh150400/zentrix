import { useQuery } from "@tanstack/react-query";
import commonAPI from "@/services/common/api";
import {useMemo} from "react";


export const useGetListBankOptions = () => {
    const listBankQuery = useQuery({
        queryKey: ["commonAPI-listBank"],
        queryFn: commonAPI.listBank,
    });
    return useMemo(() => {
        return (
            listBankQuery.data?.data.map((bank) => ({
                label: `${bank.code} - ${bank.short_name}`,
                value: bank.bin,
            })) || []
        );
    }, [listBankQuery.data]);
}