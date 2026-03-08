import { createQueries } from '@tanstack/svelte-query'
import { LocalStore } from './localStore.svelte'
import type { ChatConnection, ChatMessage, ChatServer } from '../types'
import { chatConnect, fetchMessages } from '../api'
import { SvelteSet } from 'svelte/reactivity'

type ConnKey = string & { readonly __brand: 'ConnKey' }

function connToKey(connection: ChatConnection): ConnKey {
  return `${connection.server}/${connection.channel}` as ConnKey
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export class ChatMessagesStore {
  connections = new LocalStore<ChatConnection[]>('chatConnections', [])
  connectionsStatuses = $state<Record<ConnKey, ConnectionStatus>>({})
  disconnectedConnections = $derived.by(() => {
    return Object.keys(this.connectionsStatuses).filter(
      (key) => this.connectionsStatuses[key as ConnKey] !== 'connected'
    ) as ConnKey[]
  })
  connectedConnections = $derived.by(() => {
    return Object.keys(this.connectionsStatuses).filter(
      (key) => this.connectionsStatuses[key as ConnKey] === 'connected'
    ) as ConnKey[]
  })

  messages = $state<ChatMessage[]>([])
  newMessages = $state<ChatMessage[]>([])
  lastMessageReceivedPerConnection = $state<Record<ConnKey, ChatMessage>>({})

  connectionQueries = createQueries(() => {
    // console.log('creating connection queries for:', this.disconnectedConnections)
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
      }),
      combine: (results) => {
        // console.log('combining connection queries results:', results)
        results.forEach((res, idx) => {
          const key = this.disconnectedConnections[idx]
          if (!key) return
          if (res.isFetching) {
            this.connectionsStatuses[key] = 'connecting'
            return
          }
          if (res.data?.stream_status) {
            this.connectionsStatuses[key] = res.data.stream_status
          } else {
            this.connectionsStatuses[key] = 'disconnected'
            console.log(`Failed to connect ${key}:`, res.error, res.data)
          }
        })
        return results
      }
    }
  })

  messagesResponses = createQueries(() => {
    // console.log('creating messages queries for:', this.connectedConnections)
    return {
      queries: this.connectedConnections.map((connKey) => {
        const ts = this.lastMessageReceivedPerConnection[connKey]?.ts || 0
        const [server, channel] = connKey.split('/')
        return {
          queryKey: ['fetch-chat-messages', server, channel],
          queryFn: async () => {
            const msgs = await fetchMessages({
              platform: server as ChatServer,
              channel,
              ts,
              textFilter: ''
            })
            // console.log(`Fetched messages for ${connKey}:`, msgs)
            return msgs
          },
          refetchInterval: 2000
        }
      }),
      combine: (results) => {
        // console.log('combining messages queries results:', results)
        const messagesIds = new SvelteSet(this.messages.map((msg) => msg.id))
        results.forEach((res, idx) => {
          const key = this.connectedConnections[idx]
          if (!key) return

          if (res.isError) {
            this.connectionsStatuses[key] = 'disconnected'
            console.log(`Failed to fetch messages for ${key}:`, res.error, res.data)
            return
          }

          if (res.isFetching) {
            return
          }

          const newMessages = (res.data?.chat_messages || []).filter(
            (msg) => !messagesIds.has(msg.id)
          )
          this.newMessages = newMessages
          this.messages.push(...newMessages)

          const lastMsg = res.data?.chat_messages?.[res.data.chat_messages.length - 1]
          if (this.lastMessageReceivedPerConnection[key]) {
            if (lastMsg && lastMsg.ts > this.lastMessageReceivedPerConnection[key].ts) {
              this.lastMessageReceivedPerConnection[key] = lastMsg
            }
          }
        })
        return results
      }
    }
  })

  constructor() {
    this.connections.value.forEach((c) => {
      this.connectionsStatuses[connToKey(c)] = 'disconnected'
    })
  }

  addConnection() {
    const newConn: ChatConnection = {
      server: 'twitch',
      channel: ''
    }
    this.connections.value.push(newConn)
    this.connectionsStatuses[connToKey(newConn)] = 'disconnected'
  }

  removeConnection(connection: ChatConnection) {
    const key = connToKey(connection)
    delete this.connectionsStatuses[key]
    this.connections.value = this.connections.value.filter((c) => c !== connection)
  }

  cleanupEmptyConnections() {
    this.connections.value = this.connections.value.filter((c) => c.channel.trim() !== '')
  }
}
