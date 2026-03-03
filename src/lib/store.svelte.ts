import { createQueries } from '@tanstack/svelte-query'
import { LocalStore } from './localStore.svelte'
import type { ChatConnection, ChatMessage } from './types'
import { fetchMessages } from './api'

function connToKey(connection: ChatConnection) {
  return `${connection.server}/${connection.channel}`
}

export class Store {
  connections: LocalStore<ChatConnection[]>
  messages = $state<ChatMessage[]>([])
  newMessages = $state<ChatMessage[]>([])
  lastMessageReceivedPerConnection: Record<string, ChatMessage>

  queries = createQueries(() => ({
    queries: (this.connections.value ?? []).map((connection) => {
      const ts = this.lastMessageReceivedPerConnection[connToKey(connection)]?.ts || 0
      return {
        queryKey: ['fetch-chat-messages', connection.server, connection.channel, ts],
        queryFn: () =>
          fetchMessages({
            platform: connection.server,
            channel: connection.channel,
            ts,
            textFilter: ''
          }),
        refetchInterval: 5000
      }
    })
  }))

  constructor() {
    this.connections = new LocalStore<ChatConnection[]>('chatConnections', [])
    this.lastMessageReceivedPerConnection = {}

    $effect(() => {
      this.queries.forEach((query) => {
        const result = query.data
        if (result?.chat_messages) {
          const newMessages = result.chat_messages.filter(
            (msg) => !this.messages.some((existingMsg) => existingMsg.id === msg.id)
          )
          if (newMessages.length > 0) {
            this.messages = [...this.messages, ...newMessages]
            newMessages.forEach((msg) => {
              const key = connToKey({
                server: msg.source.server,
                channel: msg.source.channel
              })
              const lastReceived = this.lastMessageReceivedPerConnection[key]
              if (!lastReceived || msg.ts > lastReceived.ts) {
                this.lastMessageReceivedPerConnection[key] = msg
              }
            })
          }
        }
      })
    })
  }
}
