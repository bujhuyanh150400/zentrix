import { client } from "@/libs/client";
import {
  AccountTypeListResponse,
  BankConfigResponse,
  ConfigResponse,
  CurrencyResponse,
  LeverResponse,
  ListBankResponse,
} from "@/services/common/@types";

const commonAPI = {
  currencies: async (): Promise<CurrencyResponse> => {
    const response = await client.get("/common/currencies");
    return response.data;
  },
  levers: async (): Promise<LeverResponse> => {
    const response = await client.get("/common/levers");
    return response.data;
  },
  accountTypeList: async (): Promise<AccountTypeListResponse> => {
    const response = await client.get("/common/account-types");
    return response.data;
  },
  listBank: async (): Promise<ListBankResponse> => {
    const response = await client.get("/common/banks");
    return response.data;
  },
  bankConfig: async (): Promise<BankConfigResponse> => {
    const response = await client.get("/config/bank-accounts");
    return response.data;
  },
  config: async (): Promise<ConfigResponse> => {
    const response = await client.get("/config/list");
    return response.data;
  },
};

export default commonAPI;
