import {AxiosError} from "axios";
import {AccountActiveResponse} from "@/services/account/@types";
import {useAddAccountStore} from "@/services/account/store";
import {useQuery} from "@tanstack/react-query";
import accountAPI from "@/services/account/api";
import {useEffect} from "react";

export type UseGetAccountActiveHookType = {
    account: AccountActiveResponse['data'] | null;
    isSuccess: boolean;
    get: () => Promise<any>;
    loading: boolean;
    error: AxiosError | null;
};

export const useGetAccountActive = (): UseGetAccountActiveHookType => {
    const {account, setAccount} = useAddAccountStore();

    const query = useQuery<AccountActiveResponse, AxiosError>({
        queryKey: ['accountAPI-accountActive'],
        queryFn: accountAPI.accountActive,
        enabled: false,
    });

    // Nếu account chưa có thì gọi lại API để lấy thông tin tài khoản đang hoạt động
    useEffect(() => {
        if (!account) {
            query.refetch();
        }
    }, [account, query]);

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setAccount(query.data.data);
        }
    }, [query.data, query.isSuccess, setAccount]);

    return {
        account,
        isSuccess: query.isSuccess,
        get: query.refetch,
        loading: query.isLoading || query.isFetching || query.isRefetching,
        error: query.error,
    }
}