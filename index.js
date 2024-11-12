import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import { isUUID } from './utilities.js';
const apiUrl = 'https://platform.sectorflow.ai/api/v1';
export class SectorFlow {
    #apiKey;
    #models;
    /**
     * Creates a new SectorFlow API object.
     * @param apiKey - The API key.
     */
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }
    /**
     * Retrieves the list of available LLMs.
     * Once retrieved, they are cached to avoid added queries.
     * @param forceRefresh - An optional parameter to bypass the cache.
     * @returns A list of available LLMs.
     */
    async getModels(forceRefresh = false) {
        if (forceRefresh || this.#models === undefined) {
            const response = await fetch(`${apiUrl}/models`, {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${this.#apiKey}`
                }
            });
            this.#models = await response.json();
        }
        return this.#models ?? [];
    }
    /**
     * A helper function to retrieve a model id by keywords.
     * i.e. getModelIdByKeywords('ChatGPT')
     * @param spaceSeparatedKeywords - A string of space-separated keywords.
     * @returns - The model id, if found.
     */
    async getModelIdByKeywords(spaceSeparatedKeywords) {
        const models = await this.getModels();
        const keywords = spaceSeparatedKeywords.toLowerCase().split(' ');
        const model = models.find((possibleModel) => {
            const stringToSearch = `${possibleModel.name} ${possibleModel.baseModel}`.toLowerCase();
            for (const keyword of keywords) {
                if (!stringToSearch.includes(keyword)) {
                    return false;
                }
            }
            return true;
        });
        if (model === undefined) {
            return undefined;
        }
        return model.id;
    }
    /**
     * Retrieves the list of projects.
     * @returns A list of projects.
     */
    async getProjects() {
        const response = await fetch(`${apiUrl}/projects`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`
            }
        });
        return await response.json();
    }
    /**
     * Creates a new project.
     * @param projectRequest - The settings for the new project.
     * @returns The new project.
     */
    async createProject(projectRequest) {
        if (projectRequest.modelIds.length === 0) {
            throw new Error('No modelIds available.');
        }
        for (const modelId of projectRequest.modelIds) {
            if (!isUUID(modelId)) {
                throw new Error(`modelId is not a valid UUID: ${modelId}`);
            }
        }
        const response = await fetch(`${apiUrl}/projects`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectRequest)
        });
        return await response.json();
    }
    /**
     * Deletes a project.
     * @param projectId - The project id.
     * @returns `true` if the project was deleted.
     */
    async deleteProject(projectId) {
        if (!isUUID(projectId)) {
            throw new Error(`projectId is not a valid UUID: ${projectId}`);
        }
        const response = await fetch(`${apiUrl}/projects/${projectId.toLowerCase()}`, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.ok;
    }
    /**
     * Uploads a file.
     * @param projectId - The project id.
     * @param filePath - The file path.
     * @returns The upload response.
     */
    async uploadFile(projectId, filePath) {
        if (!isUUID(projectId)) {
            throw new Error(`projectId is not a valid UUID: ${projectId}`);
        }
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const fileBlob = new Blob([await fs.readFile(filePath)]);
        const collectionName = randomUUID();
        const fileName = filePath.split(/[/\\]/).at(-1);
        const formData = new FormData();
        formData.append('file', fileBlob, fileName);
        formData.append('collection', collectionName);
        const response = await fetch(`${apiUrl}/chat/${projectId.toLowerCase()}/add-file`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`
            },
            body: formData
        });
        const threadJson = await response.json();
        threadJson.collectionName = collectionName;
        threadJson.fileName = fileName;
        return threadJson;
    }
    async getCollections(projectId) {
        if (!isUUID(projectId)) {
            throw new Error(`projectId is not a valid UUID: ${projectId}`);
        }
        const response = await fetch(`${apiUrl}/files/${projectId}/collections`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`
            }
        });
        return await response.json();
    }
    /**
     * Sends messages to a project, returning the responses.
     * @param projectId - The project id.
     * @param messagesRequest - The messages request.
     * @returns The responses to the messages.
     */
    async sendChatMessages(projectId, messagesRequest) {
        if (!isUUID(projectId)) {
            throw new Error(`projectId is not a valid UUID: ${projectId}`);
        }
        if (messagesRequest.threadId !== undefined &&
            !isUUID(messagesRequest.threadId)) {
            throw new Error(`threadId is not a valid UUID: ${projectId}`);
        }
        const response = await fetch(`${apiUrl}/chat/${projectId.toLowerCase()}/completions`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messagesRequest)
        });
        return await response.json();
    }
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
    async sendChatMessage(projectId, message, options) {
        let cleanMessage = message;
        let ragSettings;
        if (options?.collectionName !== undefined &&
            options.fileName !== undefined) {
            ragSettings = {
                collectionName: options.collectionName,
                fileNames: [options.fileName],
                summarize: false
            };
            cleanMessage = cleanMessage.replaceAll(/ {2,}/g, ' ');
        }
        return await this.sendChatMessages(projectId, {
            messages: [{ role: 'user', content: cleanMessage }],
            threadId: options?.threadId,
            ragSettings
        });
    }
}
