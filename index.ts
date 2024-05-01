import type { ChatMessageRequest, ProjectRequest } from './requestTypes.js'
import type {
  ChatMessageResponse,
  ModelResponse,
  ProjectResponse
} from './responseTypes.js'

const apiUrl = 'https://platform.sectorflow.ai/api/v1'

export class SectorFlow {
  readonly #apiKey: string

  /**
   * Creates a new SectorFlow API object.
   * @param {string} apiKey - The API key.
   */
  constructor(apiKey: string) {
    this.#apiKey = apiKey
  }

  /**
   * Retrieves the list of available LLMs.
   * @returns {Promise<ModelResponse[]>} - A list of available LLMs.
   */
  async getModels(): Promise<ModelResponse[]> {
    const response = await fetch(`${apiUrl}/models`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
    })

    return await response.json()
  }

  /**
   * Retrieves the list of projects.
   * @returns {Promise<ProjectResponse[]>} - A list of projects.
   */
  async getProjects(): Promise<ProjectResponse[]> {
    const response = await fetch(`${apiUrl}/projects`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
    })

    return await response.json()
  }

  /**
   * Creates a new project.
   * @param {ProjectRequest} projectRequest - The settings for the new project.
   * @returns {Promise<ProjectResponse>} - The new project.
   */
  async createProject(
    projectRequest: ProjectRequest
  ): Promise<ProjectResponse> {
    const response = await fetch(`${apiUrl}/projects`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectRequest)
    })

    return await response.json()
  }

  /**
   * Sends messages to a project, returning the responses.
   * @param {string} projectId - The project id.
   * @param {ChatMessageRequest} messagesRequest - The messages request.
   * @returns {Promise<ChatMessageResponse>} - The responses to the messages.
   */
  async sendChatMessages(
    projectId: string,
    messagesRequest: ChatMessageRequest
  ): Promise<ChatMessageResponse> {
    const response = await fetch(`${apiUrl}/chat/${projectId}/completions`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagesRequest)
    })

    return await response.json()
  }

  /**
   * Sends a message to a project, returning the responses.
   * @param {string} projectId - The project id.
   * @param {string} message - The message.
   * @param {string} threadId - The optional thread id, to continue a chain of messages.
   * @returns {Promise<ChatMessageResponse>} - The responses to the message.
   */
  async sendChatMessage(
    projectId: string,
    message: string,
    threadId?: string
  ): Promise<ChatMessageResponse> {
    return await this.sendChatMessages(projectId, {
      messages: [{ role: 'user', content: message }],
      threadId
    })
  }
}

export type {
  ChatMessageResponse,
  ModelResponse,
  ProjectResponse
} from './responseTypes.js'
