export enum ChatMessageType {
    CONNECT = 'CONNECT',
    DISCONNECT = 'DISCONNECT',
    MESSAGE = 'MESSAGE'
}

export interface ChatMessageRequest {
    content: string;
}

export interface ChatMessageResponse {
    userId: number;
    username: string;
    messageType: ChatMessageType;
    content: string;
    createdDate: string;
}