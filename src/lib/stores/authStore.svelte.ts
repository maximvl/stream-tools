import { createContext } from 'svelte'
import { createMutation, createQueries } from '@tanstack/svelte-query'
import { auth, authCheck } from '$lib/api/loto'
import type { ChatConnection, ChatServer } from '$lib/types'
import { connToKey, type ConnKey } from './chatMessagesStore.svelte'

export type AuthConnectionInfo = {
  key: ConnKey
  server: ChatServer
  channel: string
  authenticated: boolean
  authKey?: string
  isChecking: boolean
  isAuthenticating: boolean
}

export class AuthStore {
  connections = $state<ConnKey[]>([])

  connectionInfo = $state<Record<ConnKey, AuthConnectionInfo>>({})

  checkAuthQueries = createQueries(() => ({
    queries: this.connections.map((connKey) => {
      const [server, channel] = connKey.split('/')
      return {
        queryKey: ['auth-check', server, channel] as const,
        queryFn: () => authCheck({ server: server as ChatServer, channel }),
      }
    }),
    combine: (
      results: Array<{ data?: { authenticated: boolean; auth_key?: string }; isFetching: boolean }>,
    ) => {
      results.forEach((res, idx) => {
        const key = this.connections[idx]
        if (!key) return
        const [server, channel] = key.split('/')
        let info = this.connectionInfo[key]
        if (!info) {
          info = {
            key,
            server: server as ChatServer,
            channel,
            authenticated: false,
            isChecking: false,
            isAuthenticating: false,
          }
          this.connectionInfo[key] = info
        }
        if (res.isFetching) {
          info.isChecking = true
          return
        }
        info.isChecking = false
        if (res.data) {
          info.authenticated = res.data.authenticated
          info.authKey = res.data.auth_key
        }
      })
      return results
    },
  }))

  authMutation = createMutation(() => ({
    mutationFn: (connKey: ConnKey) => {
      const [server, channel] = connKey.split('/')
      return auth({ server: server as ChatServer, channel })
    },
    onMutate: (connKey) => {
      const [server, channel] = connKey.split('/')
      let info = this.connectionInfo[connKey]
      if (!info) {
        info = {
          key: connKey,
          server: server as ChatServer,
          channel,
          authenticated: false,
          isChecking: false,
          isAuthenticating: false,
        }
        this.connectionInfo[connKey] = info
      }
      info.isAuthenticating = true
    },
    onSuccess: (data, connKey) => {
      const info = this.connectionInfo[connKey]
      if (info) {
        info.authenticated = data.authenticated
      }
    },
    onSettled: (_, __, connKey) => {
      const info = this.connectionInfo[connKey]
      if (info) {
        info.isAuthenticating = false
      }
    },
  }))

  authenticate(connKey: ConnKey) {
    return this.authMutation.mutateAsync(connKey)
  }

  add(c: ChatConnection) {
    this.connections.push(connToKey(c))
  }
}

export const [getAuthStore, setAuthStore] = createContext<AuthStore>()
