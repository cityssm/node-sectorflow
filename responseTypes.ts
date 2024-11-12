import type {
  ChatHistoryType,
  ContextType,
  DateTimeString,
  SharingType,
  UUIDString
} from './types.js'

interface SectorFlowUsage {
  promptTokens: number
  completionTokes: number
  totalTokens: number
  credits: number
  responseTimeMs: number
  modelUsage: unknown[]
}

export interface ModelResponse {
  id: UUIDString
  name: string
  icon: string
  baseModel: string
  contextWindow: number
  chatCredits: number
  active: boolean
  internalUseOnly: boolean
  created: DateTimeString
  updated: DateTimeString
  usesSystemPrompts: boolean
  imageGen: boolean
  hasVision: boolean
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
  modelRating: number
  description: string
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
    modelName: string
    baseModel: string
    icon: string
    choices: Array<{
      // id: UUIDString
      modelId: UUIDString
      index: number
      active: boolean
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
    }>,
    usage: SectorFlowUsage
  }>
  usage: SectorFlowUsage
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
