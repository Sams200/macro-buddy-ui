import React, {useState, useEffect} from 'react';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {ChatMessageRequest, ChatMessageResponse} from '../../models/chat';
import {
    useConnectToPublicChatMutation, useDisconnectFromPublicChatMutation, useSendPublicChatMessageMutation
} from '../../api/chatApi';
import {SubmitHandler, useForm} from "react-hook-form";

const Chat: React.FC = () => {
    const [publicChatMessages, setPublicChatMessages] = useState<ChatMessageResponse[]>([]);
    const [socketError, setSocketError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset
    } = useForm<ChatMessageRequest>();

    const joinPublicChat = useConnectToPublicChatMutation();
    const sendPublicChatMessage = useSendPublicChatMessageMutation();
    const leavePublicChat = useDisconnectFromPublicChatMutation();

    useEffect(() => {
        const socketFactory = () => new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socketFactory);

        const onConnect = async () => {
            stompClient.subscribe('/topic/public', onMessage);
            await joinPublicChat.mutateAsync();
        };

        const onMessage = (message: { body: string; }) => {
            const receivedMessage: ChatMessageResponse = JSON.parse(message.body);
            setPublicChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };

        const onError = () => {
            setSocketError(true);
        };

        const onDisconnect = () => {
            leavePublicChat.mutate();
        };

        stompClient.connect({}, onConnect, onError);

        return () => {
            stompClient.disconnect(onDisconnect);
        };
    }, []);

    const onSubmit: SubmitHandler<ChatMessageRequest> = async (data) => {
        setIsLoading(true);
        const response = await sendPublicChatMessage.mutateAsync(data);
        setIsLoading(false);
        reset();

        if (response === null) {
            setTimeout(() => {
                clearErrors();
            }, 3000);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-semibold text-[#D4A373] mb-6">Admin Chat</h1>

            {socketError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Failed to connect to chat server. Please refresh the page or try again later.
                </div>
            )}

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Chat messages display */}
                <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                    {publicChatMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {publicChatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${
                                        message.messageType === 'MESSAGE'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-700 italic text-center text-sm'
                                    }`}
                                >
                                    {message.messageType === 'MESSAGE' ? (
                                        <>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">{message.username}</span>
                                                <span className="text-xs text-gray-500">
                        {new Date(message.createdDate).toLocaleTimeString()}
                      </span>
                                            </div>
                                            <p>{message.content}</p>
                                        </>
                                    ) : (
                                        <p>{message.content}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message input form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-grow">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.content ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#D4A373]'
                                }`}
                                {...register('content', {
                                    required: 'Message cannot be empty',
                                    maxLength: {
                                        value: 256,
                                        message: 'Message must be less than 256 characters'
                                    }
                                })}
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-2 px-4 py-2 bg-[#D4A373] text-white rounded-lg hover:bg-[#c4966a] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending
              </span>
                            ) : (
                                "Send"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Chat;