import { makeMessage } from './apiMocks'
import type { ChatMessage, ChatServer } from './types'

const URL_PREFIX = '/v2'

const MOCK_API = import.meta.env.MODE === 'development' && !URL_PREFIX.includes('127.0.0.1')

let chatResultMock: ChatMessagesResponse | null = null
const throwApiError: boolean = false
const mockedMessagesAmount = 200

export class ApiError extends Error {
  status: number
  body: {
    error: string
  }

  constructor(
    status: number,
    body: {
      error: string
    }
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
  platform
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
        error: 'channel not found'
      })
    }

    // console.log('fetching messages', channel, ts, textFilter, platform)

    if (chatResultMock) {
      const result = chatResultMock
      chatResultMock = null
      return result
    }

    // const gameMessages = [makeGameMessage(), makeGameMessage()]
    // return { chat_messages: [makeSuperGameMessage()] }
    const mocksPerRequest = 10
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
