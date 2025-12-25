import ErrorAPIServer, {
  _HTTPStatus,
  ILaravelValidationErrors,
} from "@/libs/@type";
import { BACKEND_API_URL } from "@/libs/constant_env";
import { SECURE_AUTH_TOKEN } from "@/libs/storage/key";
import secureStorage from "@/libs/storage/secureStorage";
import { LoginResponse } from "@/services/auth/@type";
import axios from "axios";

export const client = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
client.interceptors.request.use(
  async (config) => {
    // Add an authorization token if available
    const loginInfo = await secureStorage.getItem<LoginResponse>(
      SECURE_AUTH_TOKEN
    );
    if (loginInfo) {
      config.headers.Authorization = `Bearer ${loginInfo.token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response;
    const errorData = error.response?.data;
    //Nếu có lỗi trả ra từ server
    if (errorResponse && errorData) {
      let messageError: string | null | undefined = errorData.message;
      let statusCodeResponse: number | null | undefined = errorResponse?.status;

      if (!messageError)
        messageError =
          "Đã xảy ra lỗi, vui lòng liên hệ quản trị viên để được hỗ trợ.";
      if (!statusCodeResponse) statusCodeResponse = 0;
      if (statusCodeResponse === _HTTPStatus.VALIDATE_FAILED_REQUEST) {
        const errorValidate: ILaravelValidationErrors = errorData.errors;
        return Promise.reject(
          new ErrorAPIServer(
            statusCodeResponse,
            messageError,
            errorResponse,
            errorValidate
          )
        );
      } else {
        return Promise.reject(
          new ErrorAPIServer(statusCodeResponse, messageError, errorResponse)
        );
      }
    } else if (error.request) {
      return Promise.reject(
        new ErrorAPIServer(
          _HTTPStatus.BAD_REQUEST,
          "Không nhận được phản hồi từ máy chủ, vui lòng liên hệ quản trị viên để được hỗ trợ",
          errorResponse
        )
      );
    } else {
      return Promise.reject(
        new ErrorAPIServer(
          _HTTPStatus.INTERNAL_SERVER_ERROR,
          "Đã xảy ra lỗi, vui lòng liên hệ quản trị viên để được hỗ trợ.",
          errorResponse
        )
      );
    }
  }
);
