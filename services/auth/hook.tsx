import {useAuthStore, IAuthState} from "@/services/auth/store";
import {
    _AuthStatus,
    ForgotPasswordRequest,
    FormRegisterType,
    FormVerifyAccountStepOne,
    LoginRequest,
    LoginResponse,
    RegisterRequest, ResetPasswordFormType, ResetPasswordRequest, VerifyCodeRequest
} from "@/services/auth/@type";
import {router} from "expo-router";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useMutation, useQuery} from "@tanstack/react-query";
import authAPI from "@/services/auth/api";

export const checkLogin = async (hydrate: IAuthState['hydrate']) => {
    await hydrate()
    const freshStatus = useAuthStore.getState().status
    if (freshStatus === _AuthStatus.NEED_ACCESS_PIN) {
        router.replace('/(auth)/login/verify');
    } else {
        router.replace('/(auth)');
    }
};

export const useFormLogin = () => useForm<LoginRequest>({
    resolver: yupResolver(yup.object({
        email: yup.string()
            .email('Email không hợp lệ')
            .required('Email là bắt buộc'),
        password: yup.string()
            .min(8, 'Mật khẩu ít nhất 8 ký tự')
            .required('Mật khẩu là bắt buộc'),
    })),
})

export const useMutationLogin = ({onSuccess,onError}: {
    onSuccess: (data: LoginResponse) => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess,
    onError
});

export const useFormRegister = () => useForm<FormRegisterType>({
    resolver: yupResolver(
        yup.object({
            name: yup.string().trim().min(4,'Tên phải có ít nhất 4 kí tự').required('Tên là bắt buộc'),
            email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
            password: yup.string().min(8, 'Mật khẩu ít nhất 8 ký tự').required('Mật khẩu là bắt buộc'),
            confirm_password: yup.string()
                .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
                .required('Xác nhận mật khẩu là bắt buộc'),
        })
    ),
})

export const useMutationRegister = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess,
    onError
})

export const useQueryGetUserProfile = () => useQuery({
    queryKey: ['authAPI-userProfile'],
    queryFn: authAPI.userProfile,
})

export const useFormForgotPassword = () => useForm<ForgotPasswordRequest>({
    resolver: yupResolver(
        yup.object({
            email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc')
        })
    ),
})

export const useMutationForgotPassword = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authAPI.forgotPassword(data),
    onSuccess,
    onError
});

export const useMutationVerifyForgotPassword = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: VerifyCodeRequest) => authAPI.verifyCode(data),
    onSuccess,
    onError
});


export const useFormResetPassword = () => useForm<ResetPasswordFormType>({
    resolver: yupResolver(
        yup.object({
            password: yup.string().min(8, 'Mật khẩu ít nhất 8 ký tự').required('Mật khẩu là bắt buộc'),
            password_confirmation: yup.string()
                .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
                .required('Xác nhận mật khẩu là bắt buộc'),
        })
    ),
})

export const useMutationResetPassword = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: ResetPasswordRequest) => authAPI.resetPassword(data),
    onSuccess,
    onError
});

export const useFormVerifyAccountStepOne = () => useForm<FormVerifyAccountStepOne>({
    resolver: yupResolver(
        yup.object({
            first_name: yup
                .string()
                .required("Họ là bắt buộc.")
                .max(255, "Họ không được vượt quá 255 ký tự."),
            last_name: yup
                .string()
                .required("Tên là bắt buộc.")
                .max(255, "Tên không được vượt quá 255 ký tự."),
            dob: yup
                .string()
                .required("Ngày sinh là bắt buộc.")
                .matches(
                    /^\d{4}-\d{2}-\d{2}$/,
                    "Ngày sinh phải có định dạng YYYY-MM-DD"
                ),
            gender: yup
                .mixed<"male" | "female" | "other">()
                .oneOf(["male", "female", "other"], "Giới tính không hợp lệ")
                .required("Giới tính là bắt buộc."),
            phone_number: yup
                .string()
                .required("Số điện thoại là bắt buộc.")
                .max(20, "Số điện thoại không được vượt quá 20 ký tự."),
            bin_bank: yup.string().required("Vui lòng chọn ngân hàng"),
            account_bank: yup.string().required("Số tài khoản không được để trống"),
            account_bank_name: yup
                .string()
                .required("Tên chủ tài khoản không được để trống"),
            address: yup
                .string()
                .required("Địa chỉ là bắt buộc.")
                .max(500, "Địa chỉ không được vượt quá 500 ký tự."),
        })
    ),
});

export const useMutationVerifyAccount = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: FormData) => authAPI.verifyAccount(data),
    onSuccess,
    onError
});