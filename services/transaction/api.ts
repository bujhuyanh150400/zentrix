import { ResponseSuccessType } from "@/libs/@type";
import { client } from "@/libs/client";
import {
  StoreTransactionRequestType,
  StoreTransactionResponseType,
  TotalTransactionRequestType,
  TransactionCancelRequestType,
  TransactionClosedRequestType,
  TransactionHistoryRequestType,
  TransactionHistoryResponseType,
  TransactionOpenNowRequestType,
} from "@/services/transaction/@types";

const prefix = "/transaction";
const transactionAPI = {
  store: async (
    data: StoreTransactionRequestType
  ): Promise<ResponseSuccessType> => {
    const response = await client.post(`${prefix}/store`, data);
    console.log("respone tra vfe", response);
    return response.data;
  },
  total: async (
    data: TotalTransactionRequestType
  ): Promise<StoreTransactionResponseType> => {
    const response = await client.get(`${prefix}/total/${data.account_id}`);
    return response.data;
  },
  history: async (
    data: TransactionHistoryRequestType
  ): Promise<TransactionHistoryResponseType> => {
    const response = await client.get(`${prefix}/history/${data.account_id}`, {
      params: {
        status: data.status,
      },
    });
    return response.data;
  },
  closed: async (
    data: TransactionClosedRequestType
  ): Promise<ResponseSuccessType> => {
    const response = await client.post(`${prefix}/close`, data);
    return response.data;
  },
  openNow: async (
    data: TransactionOpenNowRequestType
  ): Promise<ResponseSuccessType> => {
    const response = await client.post(`${prefix}/open-now`, data);
    return response.data;
  },
  cancel: async (
    data: TransactionCancelRequestType
  ): Promise<ResponseSuccessType> => {
    const response = await client.post(`${prefix}/cancel`, data);
    return response.data;
  },
};
export default transactionAPI;
