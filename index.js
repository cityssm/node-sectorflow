const apiUrl = 'https://platform.sectorflow.ai/api/v1';
export class SectorFlow {
    #apiKey;
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }
    async getModels() {
        const response = await fetch(`${apiUrl}/models`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`
            }
        });
        return await response.json();
    }
    async getProjects() {
        const response = await fetch(`${apiUrl}/projects`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`
            }
        });
        return await response.json();
    }
    async createProject(projectRequest) {
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
    async sendChatMessages(projectId, messagesRequest) {
        const response = await fetch(`${apiUrl}/chat/${projectId}/completions`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${this.#apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messagesRequest)
        });
        return await response.json();
    }
    async sendChatMessage(projectId, message, threadId) {
        return await this.sendChatMessages(projectId, {
            messages: [{ role: 'user', content: message }],
            threadId
        });
    }
}
