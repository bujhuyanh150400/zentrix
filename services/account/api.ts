import {
    AccountActiveResponse,
    AccountListResponse,
    CreateAccountRequest,
    RechargeAccountRequest
} from "@/services/account/@types";
import {client} from "@/libs/client";
import {ResponseSuccessType} from "@/libs/@type";


const accountAPI = {
    accountList: async (): Promise<AccountListResponse> => {
        const response = await client.get('/list-account');
        return response.data;
    },
    accountActive: async (): Promise<AccountActiveResponse> => {
        const response = await client.get('/active-account');
        return response.data;
    },
    createAccount: async (data: CreateAccountRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/create-account', data);
        return response.data;
    },
    recharge: async (data: RechargeAccountRequest) : Promise<ResponseSuccessType> => {
        const response = await client.post('/recharge-account', data);
        return response.data;
    }
}

export default accountAPI;