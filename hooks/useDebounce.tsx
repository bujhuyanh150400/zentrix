import { useEffect, useCallback } from "react";
import {debounce} from "lodash";

const useDebounce = (
    callback: (...args: any[]) => void,
    delay: number,
    deps: any[]) => {
    const debouncedCallback = useCallback(debounce(callback, delay), [delay, ...deps]);

    // Cleanup debounce khi component unmount hoặc deps thay đổi
    useEffect(() => {
        return () => {
            debouncedCallback.cancel();
        };
    }, [debouncedCallback]);

    return debouncedCallback;
}

export default useDebounce;