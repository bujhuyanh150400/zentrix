import {useQuery} from "@tanstack/react-query";
import commonAPI from "../common/api";
import {useAppStore} from "./store";
import {useEffect} from "react";


export const useConfigApp = () => {
    const {config, setConfig, getConfig} = useAppStore();

    const query = useQuery({
        queryKey: ['commonAPI-config'],
        queryFn: async () => commonAPI.config(),
        enabled: false,
    });

    useEffect(() => {
        if (query.data?.data && query.isSuccess) {
            setConfig(query.data.data);
        }
    }, [query.data, query.isSuccess]);

    useEffect(() => {
        if (config && config.length === 0){
            query.refetch()
        }
    }, [config]);

    return {
        config,
        getConfig,
    }
}