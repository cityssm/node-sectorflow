import type { ChatMessageRequest, ProjectRequest } from './requestTypes.js';
import type { ChatMessageResponse, CollectionResponse, ModelResponse, ProjectResponse, UploadResponse } from './responseTypes.js';
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
     * Retrieves the list of projects.
     * @returns A list of projects.
     */
    getProjects(): Promise<ProjectResponse[]>;
    /**
     * Creates a new project.
     * @param projectRequest - The settings for the new project.
     * @returns The new project.
     */
    createProject(projectRequest: ProjectRequest): Promise<ProjectResponse>;
    /**
     * Deletes a project.
     * @param projectId - The project id.
     * @returns `true` if the project was deleted.
     */
    deleteProject(projectId: string): Promise<boolean>;
    /**
     * Uploads a file.
     * @param projectId - The project id.
     * @param filePath - The file path.
     * @returns The upload response.
     */
    uploadFile(projectId: string, filePath: string): Promise<UploadResponse>;
    getCollections(projectId: string): Promise<CollectionResponse[]>;
    /**
     * Sends messages to a project, returning the responses.
     * @param projectId - The project id.
     * @param messagesRequest - The messages request.
     * @returns The responses to the messages.
     */
    sendChatMessages(projectId: string, messagesRequest: ChatMessageRequest): Promise<ChatMessageResponse>;
    /**
     * Sends a message to a project, returning the responses.
     * @param projectId - The project id.
     * @param message - The message.
     * @param options - Optional.
     * @param options.threadId - The optional thread id, to continue a chain of messages.
     * @param options.collectionName - The optional SectorFlow collection name that contains the file. Used with the fileName option.
     * @param options.fileName - The optional SectorFlow file name. Used with the collectionName option.
     * @returns The responses to the message.
     */
    sendChatMessage(projectId: string, message: string, options?: {
        threadId?: string;
        collectionName?: string;
        fileName?: string;
    }): Promise<ChatMessageResponse>;
}
export type { ChatMessageResponse, ModelResponse, ProjectResponse } from './responseTypes.js';
