import {ResponseSuccessType} from "@/libs/@type";
import {client} from "@/libs/client";
import {ListWalletRequest, ListWalletResponse, WithdrawTransactionWalletRequest} from "@/services/wallet/@types";

const prefix = '/wallet';

const walletAPI = {
    withdraw: async (data: WithdrawTransactionWalletRequest): Promise<ResponseSuccessType> => {
        const response = await client.post(`${prefix}/withdraw`, data);
        return response.data;
    },
    list: async (params: ListWalletRequest): Promise<ListWalletResponse> => {
        const response = await client.get(`${prefix}/list`, {
            params: params,
        });
        return response.data;
    },
}

export default walletAPI;
