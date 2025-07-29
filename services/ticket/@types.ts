import DefaultColor from "@/components/ui/DefaultColor";

export enum _SupportTicketType {
    TECHNICAL = 1,
    PAYMENT = 2,
    TRANSACTION = 3,
}

export enum _SupportTicketStatus {
    OPEN = 1,
    CLOSED = 2,
}

export enum _SupportTicketSenderType {
    USER = 1,
    AGENT = 2,
}

export enum _SupportTicketPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

export interface Ticket {
    id: number;
    parent_id: number | null;
    user_id: number;
    type: _SupportTicketType;
    message: string;
    priority: _SupportTicketPriority;
    status: _SupportTicketStatus;
    sender_type: _SupportTicketSenderType;
    created_at: string;
}

export type ListTicketRequest = {
    keyword?: string;
    status?: _SupportTicketStatus | '';
    per_page?: number;
    page?: number;
}

export type ListTicketResponse = {
    data: Ticket[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type CreateTicketRequest = {
    message: string;
    type: _SupportTicketType;
    priority: _SupportTicketPriority
}

export type TicketThreadRequest = {
    ticket_id: number;
    page?: number;
}

export type ReplyTicketRequest = {
    message: string;
    id: number;
}

export const PRIORITY_CONFIG = {
    [_SupportTicketPriority.LOW]: {
        text: 'Thấp',
        color: DefaultColor.green[200],
    },
    [_SupportTicketPriority.MEDIUM]: {
        text: 'Trung bình',
        color: DefaultColor.yellow[200],
    },
    [_SupportTicketPriority.HIGH]: {
        text: 'Cao',
        color: DefaultColor.red[200],
    },
};

export type FormSupportStepOne = Pick<CreateTicketRequest, 'type'>;
export type FormSupportStepTwo = Pick<CreateTicketRequest, 'priority' | 'message'>;