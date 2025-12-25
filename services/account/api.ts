import { ResponseSuccessType } from "@/libs/@type";
import { client } from "@/libs/client";
import {
  AccountActiveResponse,
  AccountIdRequest,
  ActiveProtectAccountRequest,
  CreateAccountRequest,
  EditLeverRequest,
  ListAccountRequest,
  ListAccountResponse,
  ListHistoryRequest,
  ListHistoryResponse,
  RechargeAccountRequest,
  WithdrawAccountRequest,
} from "@/services/account/@types";

const accountAPI = {
  accountList: async (
    params: ListAccountRequest
  ): Promise<ListAccountResponse> => {
    const response = await client.get("/list-account", { params: params });
    return response.data;
  },
  accountActive: async (): Promise<AccountActiveResponse> => {
    const response = await client.get("/active-account");
    return response.data;
  },
  createAccount: async (
    data: CreateAccountRequest
  ): Promise<ResponseSuccessType> => {
    const response = await client.post("/create-account", data);
    return response.data;
  },
  recharge: async (
    data: RechargeAccountRequest
  ): Promise<ResponseSuccessType> => {
    const response = await client.post("/recharge-account", data);
    return response.data;
  },
  editLever: async (data: EditLeverRequest): Promise<ResponseSuccessType> => {
    const response = await client.post("/edit-lever-account", data);
    return response.data;
  },
  editActiveAccount: async (
    data: AccountIdRequest
  ): Promise<ResponseSuccessType> => {
    const response = await client.post("/edit-active-account", data);
    return response.data;
  },
  deletedAccount: async (
    data: AccountIdRequest
  ): Promise<ResponseSuccessType> => {
    const response = await client.post("/deleted-account", data);
    return response.data;
  },
  listHistory: async (
    params: ListHistoryRequest
  ): Promise<ListHistoryResponse> => {
    const response = await client.get(
      `/list-account-history/${params.account_id}`,
      {
        params: {
          params: params.page ?? 1,
        },
      }
    );
    return response.data;
  },
  withdraw: async (
    data: WithdrawAccountRequest
  ): Promise<ResponseSuccessType> => {
    const response = await client.post("/withdraw-account", data);
    return response.data;
  },
  activeProtectAccount: async (
    data: ActiveProtectAccountRequest
  ): Promise<ResponseSuccessType> => {
    const response = await client.post("/active-protect-account", data);
    return response.data;
  },
};

export default accountAPI;
