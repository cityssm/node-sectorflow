import type { ChatMessageRequest, ProjectRequest } from './requestTypes.js'
import type {
  ChatMessageResponse,
  ModelResponse,
  ProjectResponse
} from './responseTypes.js'

const apiUrl = 'https://platform.sectorflow.ai/api/v1'

export class SectorFlow {
  readonly #apiKey: string

  constructor(apiKey: string) {
    this.#apiKey = apiKey
  }

  async getModels(): Promise<ModelResponse[]> {
    const response = await fetch(`${apiUrl}/models`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
    })

    return await response.json()
  }

  async getProjects(): Promise<ProjectResponse[]> {
    const response = await fetch(`${apiUrl}/projects`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
    })

    return await response.json()
  }

  async createProject(projectRequest: ProjectRequest): Promise<ProjectResponse> {
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
