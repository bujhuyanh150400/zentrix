import {client} from "@/libs/client";
import {NewDetailRequest, NewDetailResponse, NewListRequest, NewListResponse} from "@/services/new/@types";

const prefixUrl = 'contents';

const newAPI = {
    list: async (params: NewListRequest): Promise<NewListResponse> => {
        const response = await client.get(`${prefixUrl}`, {params});
        return response.data;
    },
    detail: async (params: NewDetailRequest): Promise<NewDetailResponse> => {
        const response = await client.get(`${prefixUrl}/${params.slug}`);
        return response.data;
    },
}


export default newAPI;
