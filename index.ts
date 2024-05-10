import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

import type {
  ChatMessageRequest,
  ChatMessageRequestRagSettings,
  ProjectRequest
} from './requestTypes.js'
import type {
  ChatMessageResponse,
  CollectionResponse,
  ModelResponse,
  ProjectResponse,
  UploadResponse
} from './responseTypes.js'
import type { UUIDString } from './types.js'
import { isUUID } from './utilities.js'

const apiUrl = 'https://platform.sectorflow.ai/api/v1'

export class SectorFlow {
  readonly #apiKey: string

  #models: ModelResponse[] | undefined

  /**
   * Creates a new SectorFlow API object.
   * @param {string} apiKey - The API key.
   */
  constructor(apiKey: string) {
    this.#apiKey = apiKey
  }

  /**
   * Retrieves the list of available LLMs.
   * Once retrieved, they are cached to avoid additional queries.
   * @param {boolean} forceRefresh - An optional parameter to bypass the cache.
   * @returns {Promise<ModelResponse[]>} - A list of available LLMs.
   */
  async getModels(forceRefresh: boolean = false): Promise<ModelResponse[]> {
    if (forceRefresh || this.#models === undefined) {
      const response = await fetch(`${apiUrl}/models`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`
        }
      })

      this.#models = await response.json()
    }

    return this.#models ?? []
  }

  /**
   * A helper function to retrieve a model id by keywords.
   * i.e. getModelIdByKeywords('ChatGPT')
   * @param {string} spaceSeparatedKeywords - A string of space-separated keywords.
   * @returns {Promise<UUIDString | undefined>} - The model id, if found.
   */
  async getModelIdByKeywords(
    spaceSeparatedKeywords: string
  ): Promise<UUIDString | undefined> {
    const models = await this.getModels()

    const keywords = spaceSeparatedKeywords.toLowerCase().split(' ')

    const model = models.find((possibleModel) => {
      const stringToSearch =
        `${possibleModel.name} ${possibleModel.baseModel}`.toLowerCase()

      for (const keyword of keywords) {
        if (!stringToSearch.includes(keyword)) {
          return false
        }
      }

      return true
    })

    if (model === undefined) {
      return undefined
    }

    return model.id
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
    if (projectRequest.modelIds.length === 0) {
      throw new Error('No modelIds available.')
    }

    for (const modelId of projectRequest.modelIds) {
      if (!isUUID(modelId)) {
        throw new Error(`modelId is not a valid UUID: ${modelId}`)
      }
    }

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
   * Deletes a project.
   * @param {string} projectId - The project id.
   * @returns {Promise<boolean>} - True if the project was deleted successfully.
   */
  async deleteProject(projectId: string): Promise<boolean> {
    if (!isUUID(projectId)) {
      throw new Error(`projectId is not a valid UUID: ${projectId}`)
    }

    const response = await fetch(
      `${apiUrl}/projects/${projectId.toLowerCase()}`,
      {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.ok
  }

  /**
   * Uploads a file.
   * @param {string} projectId - The project id.
   * @param {string} filePath - The file path.
   * @returns {Promise<UploadResponse>} - The upload response.
   */
  async uploadFile(
    projectId: string,
    filePath: string
  ): Promise<UploadResponse> {
    if (!isUUID(projectId)) {
      throw new Error(`projectId is not a valid UUID: ${projectId}`)
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileBlob = new Blob([await fs.readFile(filePath)])

    const collectionName = randomUUID()
    const fileName = filePath.split(/[/\\]/).at(-1)

    const formData = new FormData()
    formData.append('file', fileBlob, fileName)
    formData.append('collection', collectionName)

    const response = await fetch(
      `${apiUrl}/chat/${projectId.toLowerCase()}/add-file`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`
        },
        body: formData
      }
    )

    const threadJson: Partial<UploadResponse> = await response.json()

    threadJson.collectionName = collectionName
    threadJson.fileName = fileName

    return threadJson as UploadResponse
  }

  async getCollections(projectId: string): Promise<CollectionResponse[]> {
    if (!isUUID(projectId)) {
      throw new Error(`projectId is not a valid UUID: ${projectId}`)
    }

    const response = await fetch(`${apiUrl}/files/${projectId}/collections`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
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
    if (!isUUID(projectId)) {
      throw new Error(`projectId is not a valid UUID: ${projectId}`)
    }

    if (
      messagesRequest.threadId !== undefined &&
      !isUUID(messagesRequest.threadId)
    ) {
      throw new Error(`threadId is not a valid UUID: ${projectId}`)
    }

    const response = await fetch(
      `${apiUrl}/chat/${projectId.toLowerCase()}/completions`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagesRequest)
      }
    )

    return await response.json()
  }

  /**
   * Sends a message to a project, returning the responses.
   * @param {string} projectId - The project id.
   * @param {string} message - The message.
   * @param {object} options - Optional.
   * @param {string} options.threadId - The optional thread id, to continue a chain of messages.
   * @param {string} options.collectionName - The optional SectorFlow collection name that contains the file. Used with the fileName option.
   * @param {string} options.fileName - The optional SectorFlow file name. Used with the collectionName option.
   * @returns {Promise<ChatMessageResponse>} - The responses to the message.
   */
  async sendChatMessage(
    projectId: string,
    message: string,
    options?: {
      threadId?: string
      collectionName?: string
      fileName?: string
    }
  ): Promise<ChatMessageResponse> {
    let ragSettings: ChatMessageRequestRagSettings | undefined

    if (
      options?.collectionName !== undefined &&
      options.fileName !== undefined
    ) {
      ragSettings = {
        collectionName: options.collectionName,
        fileNames: [options.fileName],
        summarize: false
      }
    }

    return await this.sendChatMessages(projectId, {
      messages: [{ role: 'user', content: message.replaceAll(/ {2,}/g, ' ') }],
      threadId: options?.threadId,
      ragSettings
    })
  }
}

export type {
  ChatMessageResponse,
  ModelResponse,
  ProjectResponse
} from './responseTypes.js'
