import {useForm} from "react-hook-form";

/**
 * Verify user status types
 */
export enum _VerifyUserStatus {
    ACTIVE = 1,
    IN_ACTIVE = 2,
    WAITING = 3,
}

/**
 * Auth types
 */
export enum _AuthStatus {
    NEED_ACCESS_PIN = 'need_access_pin',
    AUTHORIZED = 'authorized',
    UNAUTHORIZED = 'unauthorized',
}

export type Bank = {
    code: string;
    name: string;
    short_name: string;
    bin: string;
}
/**
 * Login
 */
export type LoginRequest = {
    email: string;
    password: string;
}
export type UserLogin = {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string;
    phone_number: string;
    address: string;
    country: string;
    dob: string;
    secret:string;
    gender: 'male' | 'female' | 'other';
    money: number;
    status: _VerifyUserStatus;
    cccd_front_image: string | null;
    cccd_back_image: string | null;
    creator_id: number | null;
    bin_bank: string;
    account_bank: string;
    account_bank_name: string;
    banks?: Bank,
    referrer_id: string | null;
    referral_code: string | null;
}
export type LoginResponse = {
    token: string;
    user: UserLogin
};

/**
 * Register
 */
export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}
export type FormRegisterType = RegisterRequest & {
    confirm_password: string
}
/**
 * Forgot password
 */
export type ForgotPasswordRequest = {
    email: string;
}

/**
 * Verify code
 */
export type VerifyCodeRequest = {
    email: string;
    code: string;
}

/**
 * Reset password
 */
export type ResetPasswordRequest= {
    email: string,
    code: string,
    password: string,
    password_confirmation: string
}

/**
 * Verify user
 */
export interface VerifyUserRequest {
    first_name: string;
    last_name: string;
    dob: string;
    gender: 'male' | 'female' | 'other';
    phone_number: string;
    bin_bank: string;
    account_bank: string;
    account_bank_name: string;
    address: string;
    cccd_front_image: File;
    cccd_back_image: File;
}

export type ResetPasswordFormType = Pick<ResetPasswordRequest, 'password' | 'password_confirmation'>

export type FormVerifyAccountStepOne = Omit<VerifyUserRequest, 'cccd_front_image' | 'cccd_back_image'>;
