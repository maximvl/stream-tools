export type ChatServer = 'twitch' | 'vkvideo' | 'kick'

export type ChatConnection = {
  server: ChatServer
  channel: string
}
