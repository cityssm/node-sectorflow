import type { ChatMessageRequest, ProjectRequest } from './requestTypes.js';
import type { ChatMessageResponse, ModelResponse, ProjectResponse } from './responseTypes.js';
export declare class SectorFlow {
    #private;
    constructor(apiKey: string);
    getModels(): Promise<ModelResponse[]>;
    getProjects(): Promise<ProjectResponse[]>;
    createProject(projectRequest: ProjectRequest): Promise<ProjectResponse>;
    sendChatMessages(projectId: string, messagesRequest: ChatMessageRequest): Promise<ChatMessageResponse>;
    sendChatMessage(projectId: string, message: string, threadId?: string): Promise<ChatMessageResponse>;
}
export type { ChatMessageResponse, ModelResponse, ProjectResponse } from './responseTypes.js';
