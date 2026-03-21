export type ChatServer = 'twitch' | 'vkvideo' | 'kick'

export type ChatConnection = {
  server: ChatServer
  channel: string
}

type VkUserRole = {
  id: string
  name: string
  largeUrl: string
  priority: number
}

type VkUserBadgeAchievement = {
  name: string
  type: string
}

type VkUserBadge = {
  id: string
  name: string
  largeUrl: string
  achievement: VkUserBadgeAchievement
}

type VkUserFields = {
  nickColor: number
  isChatModerator: boolean
  isChannelModerator: boolean
  roles: VkUserRole[]
  badges: VkUserBadge[]
}

type TwitchBadge = {
  id: string
  title: string
  image_url_4x: string
}

type TwitchUserFields = {
  color?: string
  badges: TwitchBadge[]
}

export type UserId = string & { readonly __brand: 'UserId' }

export type ChatUser = {
  id: UserId
  username: string
  vk_fields?: VkUserFields
  twitch_fields?: TwitchUserFields
  source: ChatConnection
}

export type VkMention = {
  id: number
  displayName: string
}

type VkChatFields = {
  mentions: VkMention[]
}

export type ChatMessage = {
  id: string
  ts: number
  message: string
  user: ChatUser
  vk_fields?: VkChatFields
  source: ChatConnection
}

export type LotoTicketId = string & { readonly brand: unique symbol }

export type LotoTicket = {
  id: LotoTicketId
  owner_id: string
  owner_name: string
  value: string[]
  color: string
  variant: number
  type: 'chat' | 'points'
  source: ChatConnection
  created_at: number
  isLatecomer: boolean
}
