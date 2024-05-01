export type DateTimeString =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}`

export type UUIDString = `${string}-${string}-${string}-${string}-${string}`

export type ChatHistoryType = 'USER' | 'TEAM'
export type ContextType = 'PRIVATE' | 'SHARED'
export type SharingType = 'PRIVATE' | 'TEAM'
