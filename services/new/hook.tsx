import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {NewDetailRequest, NewListRequest} from "@/services/new/@types";
import newAPI from "@/services/new/api";


export const useInfiniteNewsContentQuery = (queryParams: NewListRequest) => {
    return useInfiniteQuery({
        queryKey: ['newAPI-list', queryParams],
        queryFn: ({ pageParam = 1 }) => {
            return newAPI.list({
                ...queryParams,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
    });
};

export const useNewsListQuery = (queryParams: NewListRequest) => useQuery({
    queryKey: ['newAPI-list', queryParams],
    enabled: true,
    queryFn: async () => newAPI.list(queryParams),
    select: (res) => res.data,
});

export const useNewDetailQuery = (params: NewDetailRequest) =>  useQuery({
    queryKey: ['newAPI-detail', params],
    enabled: false,
    queryFn: async () => newAPI.detail(params),
    select: (res) => res.data,
});