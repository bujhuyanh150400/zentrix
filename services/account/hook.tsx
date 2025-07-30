import {AxiosError} from "axios";
import {
    _AccountType,
    AccountActiveResponse,
    CreateAccountRequest,
    UseGetAccountActiveHookType
} from "@/services/account/@types";
import {useAddAccountStore} from "@/services/account/store";
import {useQuery} from "@tanstack/react-query";
import accountAPI from "@/services/account/api";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";



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
        user_id: yup.number().required('User ID không được để trống'),
        name: yup.string().required('Tên tài khoản là bắt buộc'),
        password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
        currency_id: yup.number().required('Phải chọn loại tiền tệ'),
        lever_id: yup.number().required('Phải chọn tỷ lệ đòn bẩy'),
        account_type_id: yup.number().required('Phải chọn loại tài khoản'),
        account_type: yup
            .mixed<_AccountType>()
            .oneOf(Object.values(_AccountType) as _AccountType[], 'Loại tài khoản không hợp lệ')
            .required('Phải chọn loại tài khoản'),
    })),
})