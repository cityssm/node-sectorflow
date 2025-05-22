import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

import type {
  ChatMessageRequest,
  ChatMessageRequestRagSettings,
  WorkspaceRequest
} from './requestTypes.js'
import type {
  ChatMessageResponse,
  CollectionResponse,
  ModelResponse,
  UploadResponse,
  WorkspaceResponse
} from './responseTypes.js'
import type { UUIDString } from './types.js'
import { isUUID } from './utilities.js'

const apiUrl = 'https://platform.sectorflow.ai/api/v1'

export class SectorFlow {
  readonly #apiKey: string

  #models: ModelResponse[] | undefined

  /**
   * Creates a new SectorFlow API object.
   * @param apiKey - The API key.
   */
  constructor(apiKey: string) {
    this.#apiKey = apiKey
  }

  /**
   * Retrieves the list of available LLMs.
   * Once retrieved, they are cached to avoid added queries.
   * @param forceRefresh - An optional parameter to bypass the cache.
   * @returns A list of available LLMs.
   */
  async getModels(forceRefresh = false): Promise<ModelResponse[]> {
    if (forceRefresh || this.#models === undefined) {
      const response = await fetch(`${apiUrl}/models`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`
        }
      })

      this.#models = await response.json() as ModelResponse[] | undefined
    }

    return this.#models ?? []
  }

  /**
   * A helper function to retrieve a model id by keywords.
   * i.e. getModelIdByKeywords('ChatGPT')
   * @param spaceSeparatedKeywords - A string of space-separated keywords.
   * @returns - The model id, if found.
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
   * Retrieves the list of workspaces.
   * @returns A list of workspaces.
   */
  async getWorkspaces(): Promise<WorkspaceResponse[]> {
    const response = await fetch(`${apiUrl}/workspaces`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
    })

    return await response.json() as WorkspaceResponse[]
  }

  /**
   * Creates a new workspace.
   * @param workspaceRequest - The settings for the new workspace.
   * @returns The new workspace.
   */
  async createWorkspace(
    workspaceRequest: WorkspaceRequest
  ): Promise<WorkspaceResponse> {
    if (workspaceRequest.modelIds.length === 0) {
      throw new Error('No modelIds available.')
    }

    for (const modelId of workspaceRequest.modelIds) {
      if (!isUUID(modelId)) {
        throw new Error(`modelId is not a valid UUID: ${modelId}`)
      }
    }

    const response = await fetch(`${apiUrl}/workspaces`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workspaceRequest)
    })

    return await response.json() as WorkspaceResponse
  }

  /**
   * Deletes a workspace.
   * @param workspaceId - The workspace id.
   * @returns `true` if the workspace was deleted.
   */
  async deleteWorkspace(workspaceId: string): Promise<boolean> {
    if (!isUUID(workspaceId)) {
      throw new Error(`workspaceId is not a valid UUID: ${workspaceId}`)
    }

    const response = await fetch(
      `${apiUrl}/workspaces/${workspaceId.toLowerCase()}`,
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
   * @param workspaceId - The workspace id.
   * @param filePath - The file path.
   * @returns The upload response.
   */
  async uploadFile(
    workspaceId: string,
    filePath: string
  ): Promise<UploadResponse> {
    if (!isUUID(workspaceId)) {
      throw new Error(`workspaceId is not a valid UUID: ${workspaceId}`)
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileBlob = new Blob([await fs.readFile(filePath)])

    const collectionName = randomUUID()
    const fileName = filePath.split(/[/\\]/).at(-1)

    const formData = new FormData()
    formData.append('file', fileBlob, fileName)
    formData.append('collection', collectionName)

    const response = await fetch(
      `${apiUrl}/chat/${workspaceId.toLowerCase()}/add-file`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`
        },
        body: formData
      }
    )

    const threadJson = await response.json() as Partial<UploadResponse>

    threadJson.collectionName = collectionName
    threadJson.fileName = fileName

    return threadJson as UploadResponse
  }

  async getCollections(workspaceId: string): Promise<CollectionResponse[]> {
    if (!isUUID(workspaceId)) {
      throw new Error(`workspaceId is not a valid UUID: ${workspaceId}`)
    }

    const response = await fetch(`${apiUrl}/files/${workspaceId}/collections`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.#apiKey}`
      }
    })

    return await response.json() as CollectionResponse[]
  }

  /**
   * Sends messages to a workspace, returning the responses.
   * @param workspaceId - The workspace id.
   * @param messagesRequest - The messages request.
   * @returns The responses to the messages.
   */
  async sendChatMessages(
    workspaceId: string,
    messagesRequest: ChatMessageRequest
  ): Promise<ChatMessageResponse> {
    if (!isUUID(workspaceId)) {
      throw new Error(`workspaceId is not a valid UUID: ${workspaceId}`)
    }

    if (
      messagesRequest.threadId !== undefined &&
      !isUUID(messagesRequest.threadId)
    ) {
      throw new Error(`threadId is not a valid UUID: ${workspaceId}`)
    }

    const response = await fetch(
      `${apiUrl}/chat/${workspaceId.toLowerCase()}/completions`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagesRequest)
      }
    )

    return await response.json() as ChatMessageResponse
  }

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
  async sendChatMessage(
    workspaceId: string,
    message: string,
    options?: {
      threadId?: string
      collectionName?: string
      fileName?: string
    }
  ): Promise<ChatMessageResponse> {
    let cleanMessage = message
    
    // eslint-disable-next-line @typescript-eslint/init-declarations
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

      cleanMessage = cleanMessage.replaceAll(/ {2,}/g, ' ')
    }

    return await this.sendChatMessages(workspaceId, {
      messages: [{ role: 'user', content: cleanMessage }],
      threadId: options?.threadId,
      ragSettings
    })
  }
}

export type {
  ChatMessageResponse,
  ModelResponse,
  WorkspaceResponse
} from './responseTypes.js'
