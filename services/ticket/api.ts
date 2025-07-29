import {
    CreateTicketRequest,
    ListTicketRequest,
    ListTicketResponse,
    ReplyTicketRequest,
    TicketThreadRequest
} from "@/services/ticket/@types";
import {client} from "@/libs/client";
import {ResponseSuccessType} from "@/libs/@type";


const ticketAPI = {
    list: async (params: ListTicketRequest): Promise<ListTicketResponse> => {
        const response = await client.get('/tickets', {params});
        return response.data;
    },
    create: async (data: CreateTicketRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/tickets', data);
        return response.data;
    },
    reply: async (data: ReplyTicketRequest): Promise<ResponseSuccessType> => {
        const response = await client.post(`/tickets/${data.id}/reply`, {
            message: data.message
        });
        return response.data;
    },
    getTicketThread: async (params: TicketThreadRequest): Promise<ListTicketResponse> => {
        const res = await client.get(`/tickets/${params.ticket_id}`, {
            params: {
                page: params?.page || 1,
            }
        });
        return res.data;
    },
}

export default ticketAPI;