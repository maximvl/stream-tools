import { makeMessage, MocksManager } from './apiMocks'
import type { ChatMessage, ChatServer, VkRole, VkRoleId } from './types'

const URL_PREFIX = '/v2'
// const URL_PREFIX = 'http://localhost:8088/v2'

// const MOCK_API = import.meta.env.MODE === 'development' && !URL_PREFIX.includes('127.0.0.1')
const MOCK_API = true

console.log('MOCK_API', MOCK_API)

const throwApiError: boolean = false
const mockedMessagesAmount = 20

export class ApiError extends Error {
  status: number
  body: {
    error: string
  }

  constructor(
    status: number,
    body: {
      error: string
    },
  ) {
    super(`API Error: ${status}`)
    this.status = status
    this.body = body
  }
}

export type FetchMessagesParams = {
  channel: string
  platform: ChatServer
  ts: number
  textFilter?: string
}

export type ChatMessagesResponse = {
  chat_messages: null | ChatMessage[]
}

export async function fetchMessages({
  channel,
  ts,
  textFilter,
  platform,
}: FetchMessagesParams): Promise<ChatMessagesResponse> {
  const params = new URLSearchParams()
  params.set('platform', platform)
  params.set('channel', channel)
  params.set('ts', ts.toString())
  if (textFilter && textFilter.length > 0) {
    params.set('text_filter', textFilter)
  }
  const url = `${URL_PREFIX}/turnir-api/chat_messages?${params.toString()}`

  if (MOCK_API) {
    console.log(`GET ${url}`)

    if (throwApiError) {
      // Simulate an API error
      console.log('throwing api error')
      throw new ApiError(400, {
        error: 'channel not found',
      })
    }

    // console.log('fetching messages', channel, ts, textFilter, platform)

    if (MocksManager.chatMessages && MocksManager.chatMessages.length > 0) {
      const result: ChatMessagesResponse = { chat_messages: MocksManager.chatMessages as ChatMessage[] }
      MocksManager.chatMessages = []
      return result
    }

    // const gameMessages = [makeGameMessage(), makeGameMessage()]
    // return { chat_messages: [makeSuperGameMessage()] }
    const mocksPerRequest = 3
    const mocksLeft = mockedMessagesAmount - mocksPerRequest

    // console.log({ mocksLeft, mockedMessagesAmount, mocksPerRequest })

    if (mocksLeft < 0) {
      return { chat_messages: [] }
    }

    const messages = Array.from({ length: mocksPerRequest }, () => {
      return makeMessage(platform, channel)
    })

    // console.log({ messages })

    return { chat_messages: messages }
  }

  return fetch(url).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      throw new ApiError(res.status, data)
    }
    return data
  })
}

type ChatConnectParams = {
  server: ChatServer
  channel: string
}

export type ChatConnectResponse = {
  stream_status: 'connected' | 'disconnected' | 'connecting'
}

export async function chatConnect({
  server,
  channel,
}: ChatConnectParams): Promise<ChatConnectResponse> {
  const params = new URLSearchParams()
  params.set('channel', channel)
  params.set('platform', server)
  const url = `${URL_PREFIX}/turnir-api/chat_connect?${params.toString()}`

  if (MOCK_API) {
    console.log(`POST ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return { stream_status: 'connected' }
  }

  return fetch(url, {
    method: 'POST',
  }).then((res) => res.json())
}

type VkRolesResponse = {
  roles: {
    data: {
      rewards: VkRole[]
    }
  }
}

export async function fetchVkRoles(
  server: ChatServer,
  channel: string
): Promise<VkRolesResponse> {
  const params = new URLSearchParams()
  params.set('platform', server)
  params.set('channel', channel)
  const url = `${URL_PREFIX}/turnir-api/stream_info?${params.toString()}`

  if (MOCK_API) {
    console.log(`GET ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      roles: {
        data: {
          rewards: [
            {
              id: '1' as VkRoleId,
              name: 'Role 1',
              largeUrl: '',
              description: '',
              bgColor: 0,
              price: 0,
            },
          ],
        },
      },
    }
  }

  return fetch(url).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      throw new ApiError(res.status, data)
    }
    return data
  })
}
