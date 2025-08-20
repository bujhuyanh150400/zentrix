import {FieldValues, UseFormSetError, Path} from "react-hook-form";
import {useCallback} from "react";
import {showMessage} from "react-native-flash-message";
import ErrorAPIServer from "@/libs/@type";

type Params<T extends FieldValues> = {
    error: unknown;
    setError?: UseFormSetError<T>;
};
export function useApiErrorHandler<T extends FieldValues>() {
    return useCallback(({error, setError}: Params<T>) => {
        if (error instanceof ErrorAPIServer) {
            if (error.validateError && setError) {
                const validationErrors = error.validateError;
                Object.entries(validationErrors).forEach(([field, messages]) => {
                    setError(field as Path<T>, {
                        type: 'validate',
                        message: messages[0],
                    });
                });
            } else if (error.message) {
                showMessage({
                    message: error.message,
                    type: 'danger',
                    duration: 3000,
                });
            }
        } else {
            let errorHandler = error as Error;
            showMessage({
                // message: 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau',
                message: errorHandler?.message,
                type: 'danger',
                duration: 3000,
            });
        }
    }, []);
}

export function useShowErrorHandler(error: Error | any) {
    if (error instanceof ErrorAPIServer) {
        if (error.validateError) {
            const validationErrors = error.validateError;
            const firstKey = Object.keys(validationErrors)[0];
            const firstValue = validationErrors[firstKey];
            showMessage({
                message: firstValue[0],
                type: 'danger',
                duration: 3000,
            });
        } else if (error.message) {
            showMessage({
                message: error.message,
                type: 'danger',
                duration: 3000,
            });
        }
    } else {
        showMessage({
            message: 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau',
            type: 'danger',
            duration: 3000,
        });
    }
}