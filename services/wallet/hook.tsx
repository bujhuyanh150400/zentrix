import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {ListWalletRequest, WithdrawTransactionWalletRequest} from "@/services/wallet/@types";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import walletAPI from "@/services/wallet/api";
import {ListAccountRequest} from "@/services/account/@types";
import accountAPI from "@/services/account/api";


export const useWithdrawWalletUserForm = () => {
    return useForm<WithdrawTransactionWalletRequest>({
        resolver: yupResolver(yup.object({
            money: yup
                .number()
                .min(10000, 'Số tền tối thiểu là 10,000 VND')
                .max(10000000,'Số tền tối thiểu là 10,000,000 VND')
                .typeError('Số tiền phải là số')
                .required('Số tiền là bắt buộc'),
        })),
    });
}

export const useMutationWithdrawWallet = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: WithdrawTransactionWalletRequest) => walletAPI.withdraw(data),
    onSuccess,
    onError,
})

export const useInfiniteWalletList = (queryParams: ListWalletRequest) => {
    return useInfiniteQuery({
        queryKey: ['walletAPI-list', queryParams],
        queryFn: ({pageParam = 1}) => {
            return walletAPI.list({
                ...queryParams,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
    });
};