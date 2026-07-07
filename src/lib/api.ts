import { makeMessage, MocksManager } from './apiMocks'
import type { ChatMessage, ChatServer, VkRole, VkRoleId } from './types'
import sample from 'lodash/sample'
import { dev } from '$app/environment'
import random from 'lodash/random'

const TURNIR_API = '/v2/turnir-api'
const CHAT_API = 'https://chats.eventlab.dev/api'

// const URL_PREFIX = 'http://localhost:8088/v2'

// const MOCK_API = import.meta.env.MODE === 'development' && !URL_PREFIX.includes('127.0.0.1')
const MOCK_API = dev

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
  messages: null | ChatMessage[]
}

export async function fetchMessages({
  channel,
  ts,
  textFilter,
  platform,
}: FetchMessagesParams): Promise<ChatMessagesResponse> {
  const params = new URLSearchParams()
  params.set('platform', platform)
  params.set('server', channel)
  params.set('ts', ts.toString())
  if (textFilter && textFilter.length > 0) {
    params.set('text_filter', textFilter)
  }
  const url = `${CHAT_API}/chat_messages?${params.toString()}`

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
      const result: ChatMessagesResponse = {
        messages: MocksManager.chatMessages as ChatMessage[],
      }
      MocksManager.chatMessages = []
      return result
    }

    // return { chat_messages: [] }

    // const gameMessages = [makeGameMessage(), makeGameMessage()]
    // return { chat_messages: [makeSuperGameMessage()] }
    const mocksPerRequest = 1
    const mocksLeft = mockedMessagesAmount - mocksPerRequest

    // console.log({ mocksLeft, mockedMessagesAmount, mocksPerRequest })

    if (mocksLeft < 0) {
      return { messages: [] }
    }

    const messages = Array.from({ length: mocksPerRequest }, () => {
      return makeMessage()
    })

    messages.forEach((m) => {
      // m.message = sample(['1', '2', '3', '4', '5'])
      m.user.kickFields = {
        badges: [
          {
            type: 'moderator',
            name: 'Moderator',
            selected: true,
          },
        ],
        color: '#00FFFF',
      }
    })

    // console.log({ messages })

    return { messages: messages }
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
  const url = `${CHAT_API}/chat_connect`

  if (MOCK_API) {
    console.log(`POST ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return { stream_status: 'connected' }
  }

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      channel,
      server
    })
  }).then((res) => res.json())
}

type VkRolesResponse = {
  roles: {
    data: {
      rewards: VkRole[]
    }
  }
}

export async function fetchVkRoles(server: ChatServer, channel: string): Promise<VkRolesResponse> {
  const params = new URLSearchParams()
  params.set('platform', server)
  params.set('channel', channel)
  const url = `${TURNIR_API}/stream_info?${params.toString()}`

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
              largeUrl:
                'https://images.live.vkvideo.ru/smile/09868612-8082-4316-8df9-25bd147ebbd0/icon/size/small?change_time=1686325477',
              description: '',
              bgColor: 0,
              price: 0,
            },
            {
              id: '2' as VkRoleId,
              name: 'Role 2',
              largeUrl:
                'https://images.live.vkvideo.ru/smile/1fe2bca1-d6d5-4063-9860-f6a1d8e3816e/icon/size/small?change_time=1759944303',
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

type SuperGameStatus = 'skip' | 'win' | 'lose'

export type LotoWinner = {
  id: number
  username: string
  super_game_status: SuperGameStatus
  created_at: number
  stream_channel: string
}

type FetchLotoWinnersResponse = {
  winners: LotoWinner[]
}

let id = 0

export async function fetchLotoWinners(
  server: ChatServer,
  channel: string,
): Promise<FetchLotoWinnersResponse> {
  const url = `${TURNIR_API}/loto_winners?server=${server}&channel=${channel}`

  if (MOCK_API) {
    console.log(`GET ${url}`)

    const makeWinner = (): LotoWinner => {
      id++
      return {
        id,
        username: `mapcar`,
        super_game_status: sample(['win', 'lose', 'skip']) as SuperGameStatus,
        created_at: Date.now() / 1000 - random(0, 1000000),
        stream_channel: sample(['twitch/lasqa', 'vkvideo/lasqa', 'kick/lasqa']),
      }
    }

    return {
      winners: Array.from({ length: 40 }, makeWinner),
    }
  }

  return fetch(url).then((res) => res.json())
}

export type LotoWinnerData = {
  username: string
  super_game_status: 'skip' | 'win' | 'lose'
}

export async function createLotoWinner({
  server,
  channel,
  winner,
}: {
  server: ChatServer
  channel: string
  winner: LotoWinnerData
}): Promise<{ ids: Record<string, number> }> {
  const url = `${TURNIR_API}/loto_winners`
  const body = JSON.stringify({
    winners: [winner],
    channel,
    server,
  })

  if (MOCK_API) {
    console.log(`POST ${url}`)
    console.log(body)
    return {
      ids: {
        [winner.username]: random(1, 10000),
      },
    }
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((res) => res.json())
}

export async function updateLotoWinner({
  id, super_game_status, server, channel
}: {
  id: number
  super_game_status: 'skip' | 'win' | 'lose'
  server: ChatServer
  channel: string
}) {
  const url = `${TURNIR_API}/loto_winners/${id}`
  const body = JSON.stringify({
    super_game_status,
    channel,
    server,
  })

  if (MOCK_API) {
    console.log(`POST ${url}`)
    console.log(body)
    return {}
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((res) => res.json())
}