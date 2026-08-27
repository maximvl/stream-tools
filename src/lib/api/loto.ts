import { dev } from '$app/environment'
import sample from 'lodash/sample'
import random from 'lodash/random'
import { ApiError } from '../api'
import type { ChatServer } from '../types'

const LOTO_API = '/api'

const MOCK_API = dev

export type AuthCheckResponse = {
  authenticated: boolean
  auth_key?: string
}

export async function authCheck({ server, channel }: AuthCheckParams): Promise<AuthCheckResponse> {
  const params = new URLSearchParams()
  params.set('stream_channel', formatStreamChannel({ server, channel }))
  const url = `${LOTO_API}/auth_check?${params.toString()}`

  if (MOCK_API) {
    console.log(`GET ${url}`)
    return {
      authenticated: false,
      auth_key: 'abc123',
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

export type AuthResponse = {
  authenticated: boolean
}

export async function auth({ server, channel }: AuthCheckParams): Promise<AuthResponse> {
  const url = `${LOTO_API}/auth`
  const body = JSON.stringify({
    stream_channel: formatStreamChannel({ server, channel }),
  })

  if (MOCK_API) {
    console.log(`POST ${url}`)
    console.log(body)
    return {
      authenticated: true,
    }
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      throw new ApiError(res.status, data)
    }
    return data
  })
}

export type AuthCheckParams = {
  server: ChatServer
  channel: string
}

function formatStreamChannel({ server, channel }: AuthCheckParams): string {
  return `${server}/${channel}`
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

export async function fetchLotoWinners({
  server,
  channel,
}: AuthCheckParams): Promise<FetchLotoWinnersResponse> {
  const params = new URLSearchParams()
  params.set('stream_channel', formatStreamChannel({ server, channel }))
  const url = `${LOTO_API}/loto_winners?${params.toString()}`

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
  const url = `${LOTO_API}/loto_winners`
  const body = JSON.stringify({
    winners: [winner],
    stream_channel: formatStreamChannel({ server, channel }),
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
  id,
  super_game_status,
  server,
  channel,
}: {
  id: number
  super_game_status: 'skip' | 'win' | 'lose'
  server: ChatServer
  channel: string
}) {
  const url = `${LOTO_API}/loto_winners/${id}`
  const body = JSON.stringify({
    super_game_status,
    stream_channel: formatStreamChannel({ server, channel }),
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
