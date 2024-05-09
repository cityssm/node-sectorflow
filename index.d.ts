import type { ChatMessageRequest, ProjectRequest } from './requestTypes.js';
import type { ChatMessageResponse, CollectionResponse, ModelResponse, ProjectResponse, UploadResponse } from './responseTypes.js';
import type { UUIDString } from './types.js';
export declare class SectorFlow {
    #private;
    /**
     * Creates a new SectorFlow API object.
     * @param {string} apiKey - The API key.
     */
    constructor(apiKey: string);
    /**
     * Retrieves the list of available LLMs.
     * Once retrieved, they are cached to avoid additional queries.
     * @param {boolean} forceRefresh - An optional parameter to bypass the cache.
     * @returns {Promise<ModelResponse[]>} - A list of available LLMs.
     */
    getModels(forceRefresh?: boolean): Promise<ModelResponse[]>;
    /**
     * A helper function to retrieve a model id by keywords.
     * i.e. getModelIdByKeywords('ChatGPT')
     * @param {string} spaceSeparatedKeywords - A string of space-separated keywords.
     * @returns {Promise<UUIDString | undefined>} - The model id, if found.
     */
    getModelIdByKeywords(spaceSeparatedKeywords: string): Promise<UUIDString | undefined>;
    /**
     * Retrieves the list of projects.
     * @returns {Promise<ProjectResponse[]>} - A list of projects.
     */
    getProjects(): Promise<ProjectResponse[]>;
    /**
     * Creates a new project.
     * @param {ProjectRequest} projectRequest - The settings for the new project.
     * @returns {Promise<ProjectResponse>} - The new project.
     */
    createProject(projectRequest: ProjectRequest): Promise<ProjectResponse>;
    /**
     * Deletes a project.
     * @param {string} projectId - The project id.
     * @returns {Promise<boolean>} - True if the project was deleted successfully.
     */
    deleteProject(projectId: string): Promise<boolean>;
    /**
     * Uploads a file.
     * @param {string} projectId - The project id.
     * @param {string} filePath - The file path.
     * @returns {Promise<UploadResponse>} - The upload response.
     */
    uploadFile(projectId: string, filePath: string): Promise<UploadResponse>;
    getCollections(projectId: string): Promise<CollectionResponse[]>;
    /**
     * Sends messages to a project, returning the responses.
     * @param {string} projectId - The project id.
     * @param {ChatMessageRequest} messagesRequest - The messages request.
     * @returns {Promise<ChatMessageResponse>} - The responses to the messages.
     */
    sendChatMessages(projectId: string, messagesRequest: ChatMessageRequest): Promise<ChatMessageResponse>;
    /**
     * Sends a message to a project, returning the responses.
     * @param {string} projectId - The project id.
     * @param {string} message - The message.
     * @param {string} threadId - The optional thread id, to continue a chain of messages.
     * @returns {Promise<ChatMessageResponse>} - The responses to the message.
     */
    sendChatMessage(projectId: string, message: string, options?: {
        threadId?: string;
        collectionName?: string;
        fileName?: string;
    }): Promise<ChatMessageResponse>;
}
export type { ChatMessageResponse, ModelResponse, ProjectResponse } from './responseTypes.js';
