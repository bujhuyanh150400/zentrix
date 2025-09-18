

export enum _TypeNewContent {
    POST = 'post',
    NEWS = 'news',
    POLICY = 'policy',
}

export type NewContent = {
    id: number,
    title: string,
    summary: string,
    image: string | null,
    slug:string,
    published_at: string,
    type: _TypeNewContent,
}
export type NewListRequest = {
    type?: _TypeNewContent,
    page?: number,
    limit?:number,
};
export type NewListResponse = {
    data: NewContent[],
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type NewContentDetail = {
    id: number,
    title: string,
    summary: string,
    image: string | null,
    content: string,
    slug:string,
    published_at: string,
    type: _TypeNewContent,
    view: number | null,
    author: string,
}

export type NewDetailRequest = {
    slug: string,
};

export type NewDetailResponse = {
    data: NewContentDetail,
    message:string
}
