import {AxiosError} from "axios";
import {
    _AccountType,
    Account,
    AccountActiveResponse, AccountIdRequest, ActiveProtectAccountRequest,
    CreateAccountRequest,
    EditLeverRequest,
    ListAccountRequest, ListHistoryRequest,
    RechargeAccountForm,
    RechargeAccountRequest,
    UseGetAccountActiveHookType, WithdrawAccountRequest
} from "@/services/account/@types";
import {useAddAccountStore} from "@/services/account/store";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import accountAPI from "@/services/account/api";
import {useEffect, useMemo} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import commonAPI from "@/services/common/api";


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
    }, [account]);

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setAccount(query.data.data);
        }
    }, [query.data, query.isSuccess]);

    return {
        account,
        isSuccess: query.isSuccess,
        get: query.refetch,
        loading: query.isLoading || query.isFetching || query.isRefetching,
        error: query.error,
    }
}

export const useFormCreateAccount = () => useForm<CreateAccountRequest>({
    resolver: yupResolver(yup.object({
        name: yup.string().required('Tên tài khoản là bắt buộc'),
        password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
        lever_id: yup.number().min(0,'Phải chọn tỷ lệ đòn bẩy').required('Phải chọn tỷ lệ đòn bẩy'),
        account_type_id: yup.number().required('Phải chọn loại tài khoản'),
        account_type: yup
            .mixed<_AccountType>()
            .oneOf(Object.values(_AccountType) as _AccountType[], 'Loại tài khoản không hợp lệ')
            .required('Phải chọn loại tài khoản'),
    })),
})

export const useQueryAccountTypeList = () => useQuery({
    queryKey: ['commonAPI-accountTypeList'],
    queryFn: commonAPI.accountTypeList,
});

export const useGetLeverOptions = () => {
    const leversQuery = useQuery({
        queryKey: ['commonAPI-levers'],
        queryFn: commonAPI.levers,
    });
    return useMemo(() => {
        return leversQuery.data?.data.map(lever => ({
            label: `${lever.min} - ${lever.max}`,
            value: lever.id.toString(),
        })) || [];
    }, [leversQuery.data]);
}

export const useMutationCreateAccount = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: CreateAccountRequest) => accountAPI.createAccount(data),
    onSuccess,
    onError
});


export const useRechargeAccountForm = (account: Account| null) => {
    const schema: yup.ObjectSchema<RechargeAccountForm> = useMemo(() => yup.object({
        account_id: yup.number().required(),
        money: yup
            .number()
            .typeError('Số tiền phải là số')
            .required('Số tiền là bắt buộc')
            .min( Number(account?.account_type.min || 0), ({ min }) => `Số tiền tối thiểu là ${min.toLocaleString('en-US')} USD`)
            .max( Number(account?.account_type.max || 0), ({ max }) => `Số tiền tối đa là ${max.toLocaleString('en-US')} USD`),
        transaction_code: yup.string().nullable(),
        amount_vnd: yup.number().nullable()
    }),[account]);

    return  useForm<RechargeAccountForm>({
        resolver: yupResolver(schema),
    });
}

export const useMutationRecharge = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: RechargeAccountRequest) => accountAPI.recharge(data),
    onSuccess,
    onError
});

export const useMutationEditLever = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: EditLeverRequest) => accountAPI.editLever(data),
    onSuccess,
    onError,
});

export const useInfiniteAccountList = (queryParams: ListAccountRequest) => {
    return useInfiniteQuery({
        queryKey: ['accountAPI-accountList', queryParams],
        queryFn: ({pageParam = 1}) => {
            return accountAPI.accountList({
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

export const useMutationEditActiveAccount = () => useMutation({
    mutationFn: (data: AccountIdRequest) => accountAPI.editActiveAccount(data),
});

export const useMutationDeletedAccount = () => useMutation({
    mutationFn: (data: AccountIdRequest) => accountAPI.deletedAccount(data),
});

export const useInfiniteHistoryList = (queryParams: ListHistoryRequest) => {
    return useInfiniteQuery({
        queryKey: ['accountAPI-listHistory', queryParams],
        queryFn: ({pageParam = 1}) => {
            return accountAPI.listHistory({
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

export const useWithdrawAccountForm = () => {
    return useForm<WithdrawAccountRequest>({
        resolver: yupResolver(yup.object({
            account_id: yup.number().required(),
            money: yup
                .number()
                .typeError('Số tiền phải là số')
                .required('Số tiền là bắt buộc'),
            transaction_code: yup.string().required(),
            amount_vnd: yup.number().required()
        })),
    });
}

export const useMutationWithdraw = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: WithdrawAccountRequest) => accountAPI.withdraw(data),
    onSuccess,
    onError
});


export const useMutationActiveProtectAccount = () => useMutation({
    mutationFn: (data: ActiveProtectAccountRequest) => accountAPI.activeProtectAccount(data),
});