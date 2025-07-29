import {
    _SupportTicketPriority, CreateTicketRequest,
    FormSupportStepTwo,
    ListTicketRequest,
    ReplyTicketRequest,
    TicketThreadRequest
} from "@/services/ticket/@types";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import ticketAPI from "@/services/ticket/api";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";


export const useInfiniteTicketThreadQuery = (queryParams: TicketThreadRequest, enabled: boolean) => {
    return useInfiniteQuery({
        queryKey: ['ticketAPI-getTicketThread', queryParams],
        queryFn: ({ pageParam = 1 }) => {
            return ticketAPI.getTicketThread({
                ...queryParams,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
        enabled,
    });
};

export const useMutationReplyTicket = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: ReplyTicketRequest) => ticketAPI.reply(data),
    onSuccess,
    onError
});

export const useInfiniteTicketList = (queryParams: ListTicketRequest = {}) => {
    return useInfiniteQuery({
        queryKey: ['ticketAPI-list', queryParams],
        queryFn: ({pageParam = 1}) => {
            return ticketAPI.list({
                ...queryParams,
                page: pageParam,
                per_page: 10
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
    });
};

export const useFormSupportStepTwo = () => useForm<FormSupportStepTwo>({
    resolver: yupResolver(
        yup.object({
            priority: yup.mixed<_SupportTicketPriority>().required("Độ ưu tiên là bắt buộc"),
            message: yup.string().trim('Phản hồi là bắt buộc').required('Phản hồi là bắt buộc').typeError('Phản hồi là bắt buộc'),
        })
    ),
})

export const useMutationCreateTicket = ({onSuccess,onError}: {
    onSuccess: () => Promise<void>;
    onError: (error: any) => void;
}) => useMutation({
    mutationFn: (data: CreateTicketRequest) => ticketAPI.create(data),
    meta: {
        loadingMessage: "Đang gửi yêu cầu hỗ trợ...",
    },
    onSuccess,
    onError
});