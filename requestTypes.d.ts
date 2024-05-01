import type { ChatHistoryType, ContextType, SharingType } from './types.js';
export interface ProjectRequest {
    modelIds: string[];
    name: string;
    chatHistoryType: ChatHistoryType;
    contextType: ContextType;
    sharingType: SharingType;
}
export interface ChatMessageRequest {
    messages: Array<{
        role: 'user';
        content: string;
    }>;
    threadId?: string;
    /** Undocumented */
    models?: string[];
}
