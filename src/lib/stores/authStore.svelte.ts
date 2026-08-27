import { createContext } from 'svelte'
import { createQueries } from '@tanstack/svelte-query'
import { auth, authCheck } from '$lib/api/loto'
import type { ChatConnection, ChatServer } from '$lib/types'
import { connToKey, type ConnKey } from './chatMessagesStore.svelte'

const CONFIRM_INTERVAL_MS = 5000
const CONFIRM_MAX_ATTEMPTS = 5

export type AuthConnectionInfo = {
  key: ConnKey
  server: ChatServer
  channel: string
  authenticated: boolean
  authKey?: string
  isChecking: boolean
  isConfirming: boolean
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
            isConfirming: false,
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

  confirmAuth(connKey: ConnKey) {
    const [server, channel] = connKey.split('/')
    const info = this.connectionInfo[connKey]
    if (info) info.isConfirming = true

    let attempts = 0
    const tick = async () => {
      attempts++
      try {
        const res = await auth({ server: server as ChatServer, channel })
        const i = this.connectionInfo[connKey]
        if (i) i.authenticated = res.authenticated
        if (res.authenticated) {
          if (i) i.isConfirming = false
          return
        }
      } catch {
        // ignore errors, keep polling
      }
      const i = this.connectionInfo[connKey]
      if (attempts >= CONFIRM_MAX_ATTEMPTS) {
        if (i) i.isConfirming = false
      } else {
        setTimeout(tick, CONFIRM_INTERVAL_MS)
      }
    }
    tick()
  }

  add(c: ChatConnection) {
    this.connections.push(connToKey(c))
  }
}

export const [getAuthStore, setAuthStore] = createContext<AuthStore>()
