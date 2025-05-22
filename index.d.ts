import type { ChatMessageRequest, WorkspaceRequest } from './requestTypes.js';
import type { ChatMessageResponse, CollectionResponse, ModelResponse, UploadResponse, WorkspaceResponse } from './responseTypes.js';
import type { UUIDString } from './types.js';
export declare class SectorFlow {
    #private;
    /**
     * Creates a new SectorFlow API object.
     * @param apiKey - The API key.
     */
    constructor(apiKey: string);
    /**
     * Retrieves the list of available LLMs.
     * Once retrieved, they are cached to avoid added queries.
     * @param forceRefresh - An optional parameter to bypass the cache.
     * @returns A list of available LLMs.
     */
    getModels(forceRefresh?: boolean): Promise<ModelResponse[]>;
    /**
     * A helper function to retrieve a model id by keywords.
     * i.e. getModelIdByKeywords('ChatGPT')
     * @param spaceSeparatedKeywords - A string of space-separated keywords.
     * @returns - The model id, if found.
     */
    getModelIdByKeywords(spaceSeparatedKeywords: string): Promise<UUIDString | undefined>;
    /**
     * Retrieves the list of workspaces.
     * @returns A list of workspaces.
     */
    getWorkspaces(): Promise<WorkspaceResponse[]>;
    /**
     * Creates a new workspace.
     * @param workspaceRequest - The settings for the new workspace.
     * @returns The new workspace.
     */
    createWorkspace(workspaceRequest: WorkspaceRequest): Promise<WorkspaceResponse>;
    /**
     * Deletes a workspace.
     * @param workspaceId - The workspace id.
     * @returns `true` if the workspace was deleted.
     */
    deleteWorkspace(workspaceId: string): Promise<boolean>;
    /**
     * Uploads a file.
     * @param workspaceId - The workspace id.
     * @param filePath - The file path.
     * @returns The upload response.
     */
    uploadFile(workspaceId: string, filePath: string): Promise<UploadResponse>;
    getCollections(workspaceId: string): Promise<CollectionResponse[]>;
    /**
     * Sends messages to a workspace, returning the responses.
     * @param workspaceId - The workspace id.
     * @param messagesRequest - The messages request.
     * @returns The responses to the messages.
     */
    sendChatMessages(workspaceId: string, messagesRequest: ChatMessageRequest): Promise<ChatMessageResponse>;
    /**
     * Sends a message to a workspace, returning the responses.
     * @param workspaceId - The workspace id.
     * @param message - The message.
     * @param options - Optional.
     * @param options.threadId - The optional thread id, to continue a chain of messages.
     * @param options.collectionName - The optional SectorFlow collection name that contains the file. Used with the fileName option.
     * @param options.fileName - The optional SectorFlow file name. Used with the collectionName option.
     * @returns The responses to the message.
     */
    sendChatMessage(workspaceId: string, message: string, options?: {
        threadId?: string;
        collectionName?: string;
        fileName?: string;
    }): Promise<ChatMessageResponse>;
}
export type { ChatMessageResponse, ModelResponse, WorkspaceResponse } from './responseTypes.js';
export * as wizards from './wizards.js';
