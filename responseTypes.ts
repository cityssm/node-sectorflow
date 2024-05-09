import type {
  ChatHistoryType,
  ContextType,
  DateTimeString,
  SharingType,
  UUIDString
} from './types.js'

export interface ModelResponse {
  id: UUIDString
  name: string
  icon: string
  baseModel: string
  contextWindow: number
  chatCredits: number
  active: boolean
  created: DateTimeString
  updated: DateTimeString
  settingsAvailable: Array<{
    fieldName: string
    name: string
    description: string
  }>
  instructionFollowing: boolean
  promptWrapper: {
    wrapperName: string
    value: string
  }
}

export interface ProjectResponse {
  id: string
  name: string
  models: Array<{
    modelId: UUIDString
    name: string
    baseModel: string
    icon: string
  }>
  chatHistoryType: ChatHistoryType
  contextType: ContextType
  sharingType: SharingType
}

export interface ChatMessageResponse {
  threadId: UUIDString
  chatId: UUIDString
  choices: Array<{
    modelId: UUIDString
    name: string
    baseModel: string
    icon: string
    choices: Array<{
      id: UUIDString
      modelId: UUIDString
      index: number
      message: {
        role: 'assistant' | string
        content: string
      }
      sources?: Array<{
        id: UUIDString
        sourceName: string
        text: string
        pageNum: number
        matchScore: number
      }>
      finishReason?: 'stop' | 'error' | string
    }>
  }>
  usage: {
    promptTokens: number
    completionTokes: number
    totalTokens: number
    modelUsage: unknown[]
  }
}

export interface CollectionResponse {
  id: number
  externalId: string
  name: string
  collectionType: 'project'
  created: DateTimeString
  files: Array<{
    id: UUIDString
    externalId: string
    bytes: number
    created: DateTimeString
    filename: string
    mimeType: string
    purpose: 'assistants'
  }>
}

export interface UploadResponse {
  threadId: UUIDString
  collectionName: string
  fileName: string
}
