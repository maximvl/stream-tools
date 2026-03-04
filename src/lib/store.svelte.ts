import { createQueries } from '@tanstack/svelte-query'
import { LocalStore } from './localStore.svelte'
import type { ChatConnection, ChatMessage, ChatServer } from './types'
import { chatConnect, fetchMessages } from './api'

type ConnKey = string & { readonly __brand: 'ConnKey' }

function connToKey(connection: ChatConnection): ConnKey {
  return `${connection.server}/${connection.channel}` as ConnKey
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export class Store {
  connections: LocalStore<ChatConnection[]>
  connectionsStatuses: Record<ConnKey, ConnectionStatus> = $state<
    Record<ConnKey, ConnectionStatus>
  >({})
  disconnectedConnections = $derived.by(() => {
    return Object.keys(this.connectionsStatuses).filter(
      (key) => this.connectionsStatuses[key as ConnKey] !== 'connected'
    ) as ConnKey[]
  })

  messages = $state<ChatMessage[]>([])
  newMessages = $state<ChatMessage[]>([])
  lastMessageReceivedPerConnection: Record<ConnKey, ChatMessage>

  messagesQueries = createQueries(() => ({
    queries: (this.connections.value ?? []).map((connection) => {
      const ts = this.lastMessageReceivedPerConnection[connToKey(connection)]?.ts || 0
      const isConnected = this.connectionsStatuses[connToKey(connection)] === 'connected'
      return {
        enabled: isConnected,
        queryKey: ['fetch-chat-messages', connection.server, connection.channel, ts],
        queryFn: () =>
          fetchMessages({
            platform: connection.server,
            channel: connection.channel,
            ts,
            textFilter: ''
          }),
        refetchInterval: 2000
      }
    })
  }))

  connectionQueries = createQueries(() => {
    return {
      queries: this.disconnectedConnections.map((key) => {
        const [server, channel] = key.split('/')
        return {
          queryKey: ['chat-connect', server, channel],
          queryFn: async () =>
            chatConnect({
              server: server as ChatServer,
              channel
            }),
          refetchInterval: 3000
        }
      })
    }
  })

  constructor() {
    this.connections = new LocalStore<ChatConnection[]>('chatConnections', [])
    this.lastMessageReceivedPerConnection = {}
    this.connectionsStatuses = {
      ...this.connections.value?.reduce(
        (acc, connection) => {
          acc[connToKey(connection)] = 'disconnected'
          return acc
        },
        {} as Record<ConnKey, ConnectionStatus>
      )
    }

    $effect(() => {
      this.connectionQueries.forEach((query, idx) => {
        const key = this.disconnectedConnections[idx]
        if (!key) return

        if (query.data?.stream_status) {
          switch (query.data.stream_status) {
            case 'connected':
              this.connectionsStatuses[key] = 'connected'
              break
            case 'connecting':
              this.connectionsStatuses[key] = 'connecting'
              break
            case 'disconnected':
              this.connectionsStatuses[key] = 'disconnected'
              break
            default:
              this.connectionsStatuses[key] = 'disconnected'
              console.log(`Unknown stream status for ${key}:`, query.data)
          }
        } else {
          this.connectionsStatuses[key] = 'disconnected'
          console.log(`Failed to connect ${key}:`, query.error, query.data)
        }
      })
    })

    $effect(() => {
      this.messagesQueries.forEach((query, idx) => {
        const conn = this.connections.value?.[idx]
        if (!conn) return
        const key = connToKey(conn)

        if (query.data?.chat_messages) {
          const newMessages = query.data.chat_messages.filter(
            (msg) => !this.messages.some((existingMsg) => existingMsg.id === msg.id)
          )
          if (newMessages.length > 0) {
            this.messages = [...this.messages, ...newMessages]
            newMessages.forEach((msg) => {
              const lastReceived = this.lastMessageReceivedPerConnection[key]
              if (!lastReceived || msg.ts > lastReceived.ts) {
                this.lastMessageReceivedPerConnection[key] = msg
              }
            })
          }
        } else {
          this.connectionsStatuses[key] = 'disconnected'
          console.log(`Connection ${key} disconnected due to error:`, query.error, query.data)
        }
      })
    })
  }
}
