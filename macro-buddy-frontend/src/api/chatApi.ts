import { post } from './apiClient';
import { ChatMessageRequest, ChatMessageResponse } from '../models/chat';
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function connectToPublicChatFn() {
    try {
        return await post<ChatMessageResponse>('/authenticated/chat/connect-to-public-chat');
    }
    catch (error) {
        return null;
    }
}

export const useConnectToPublicChatMutation = () => {
    return useMutation<ChatMessageResponse | null, Error>({
        mutationFn: connectToPublicChatFn,
        mutationKey: ["connectToPublicChat"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error("Could not connect to PublicChat");
        }
    });
}

async function disconnectFromPublicChatFn() {
    try {
        return await post<ChatMessageResponse>("/authenticated/chat/disconnect-from-public-chat");
    }
    catch (error) {
        return null;
    }
}

export const useDisconnectFromPublicChatMutation = () => {
    return useMutation<ChatMessageResponse | null, Error>({
        mutationFn: disconnectFromPublicChatFn,
        mutationKey: ["disconnectFromPublicChat"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error("Could not connect to PublicChat");
        }
    });
}

async function sendPublicChatMessageFn(request: ChatMessageRequest) {

    try {
        return await post<ChatMessageResponse>("/authenticated/chat/send-public-message", request);
    }

    catch (error) {
        return null;
    }
}

export const useSendPublicChatMessageMutation = () => {
    return useMutation<ChatMessageResponse | null, Error, ChatMessageRequest>({
        mutationFn: sendPublicChatMessageFn,
        mutationKey: ["sendPublicChatMessage"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error("Could not send public message");
        }
    });
}