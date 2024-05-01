import type { ChatHistoryType, ContextType, DateTimeString, SharingType, UUIDString } from './types.js';
export interface ModelResponse {
    id: UUIDString;
    name: string;
    icon: string;
    baseModel: string;
    contextWindow: number;
    chatCredits: number;
    active: boolean;
    created: DateTimeString;
    updated: DateTimeString;
    settingsAvailable: Array<{
        fieldName: string;
        name: string;
        description: string;
    }>;
    instructionFollowing: boolean;
    promptWrapper: {
        wrapperName: string;
        value: string;
    };
}
export interface ProjectResponse {
    id: string;
    name: string;
    models: Array<{
        modelId: UUIDString;
        name: string;
        baseModel: string;
        icon: string;
    }>;
    chatHistoryType: ChatHistoryType;
    contextType: ContextType;
    sharingType: SharingType;
}
export interface ChatMessageResponse {
    threadId: UUIDString;
    chatId: UUIDString;
    choices: Array<{
        modelId: UUIDString;
        name: string;
        baseModel: string;
        icon: string;
        choices: Array<{
            id: UUIDString;
            modelId: UUIDString;
            index: number;
            message: {
                role: 'assistant' | string;
                content: string;
            };
            finishReason: 'stop' | string;
        }>;
    }>;
    usage: {
        promptTokens: number;
        completionTokes: number;
        totalTokens: number;
        modelUsage: unknown[];
    };
}
