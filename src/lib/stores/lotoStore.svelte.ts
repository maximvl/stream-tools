import type { ChatMessage, ChatUser, LotoTicket, LotoTicketId, UserId, VkMention } from '$lib/types'
import sampleSize from 'lodash/sampleSize'
import uniq from 'lodash/uniq'
import { SvelteMap, SvelteSet } from 'svelte/reactivity'

type GameState = 'registration' | 'playing'
type SuperGameResultItem = 'empty' | 'x1' | 'x2' | 'x3' | { vk_custom: string }

const LOTO_MATCH = 'лото'

export type LotoConfig = {
  ticketSize: number
  maxNumber: number
}

export class LotoStore {
  drawPool = $state<string[]>([])
  drawnNumbers = $state<string[]>([])
  gameState = $state<GameState>('registration')
  nextNumber = $state<string>('')
  rollAnimationState = $state<'idle' | 'roll_start' | 'rolling'>('idle')

  ticketsFromChat = $state<LotoTicket[]>([])
  ticketsFromPoints = $state<LotoTicket[]>([])

  superGameValues = $state<SuperGameResultItem[]>([])
  superGameGuesses = $state<number[]>([])
  superGameRevealedIds = $state<number[]>([])

  usersById = $state<SvelteMap<string, ChatUser>>(new SvelteMap())
  openedChats = $state<Set<UserId>>(new SvelteSet())

  config: LotoConfig

  constructor(config: LotoConfig) {
    this.config = config
    this.drawPool = Array.from({ length: config.maxNumber }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    )
  }

  ticketsOrdered = $derived.by(() => {
    if (this.gameState === 'registration') {
      const allTickets = [...this.ticketsFromChat, ...this.ticketsFromPoints]
      allTickets.sort((t1, t2) => t2.created_at - t1.created_at)
      return allTickets
    }
    if (this.gameState === 'playing') {
      const allTickets = [...this.ticketsFromChat, ...this.ticketsFromPoints]

      const drawnSet = new SvelteSet(this.drawnNumbers)

      allTickets.sort((t1, t2) => {
        const score1 = getTicketMatchScore(t1, drawnSet)
        const score2 = getTicketMatchScore(t2, drawnSet)
        if (score1 !== score2) {
          return score2 - score1
        }
        return t1.created_at - t2.created_at
      })
      return allTickets
    }
    return []
  })

  addTicket = (msg: ChatMessage) => {
    if (!msg.message.toLowerCase().includes(LOTO_MATCH)) {
      return
    }

    const ticket = makeTicket({ chatMessage: msg, pool: this.drawPool, config: this.config })
    const user: ChatUser = {
      id: msg.user.id,
      source: msg.source,
      username: msg.user.username,
      twitch_fields: msg.user.twitch_fields,
      vk_fields: msg.user.vk_fields
    }

    if (isMessageFromVkBot(msg)) {
      const mention = msg.vk_fields?.mentions[0] as VkMention
      if (mention) {
        user.id = mention.id.toString() as UserId
        user.username = mention.displayName
        const existingUser = this.usersById.get(user.id)
        if (!existingUser) {
          user.vk_fields = undefined
          this.usersById.set(user.id, user)
        }

        this.ticketsFromPoints = this.ticketsFromPoints.filter((t) => t.owner_id !== user.id)

        ticket.type = 'points'
        ticket.owner_id = user.id
        ticket.owner_name = user.username
        this.ticketsFromPoints.push(ticket)
      }
      return
    }
    if (isMessageHighlightedOnTwitch(msg)) {
      this.ticketsFromPoints = this.ticketsFromPoints.filter((t) => t.owner_id !== user.id)

      ticket.type = 'points'
      this.usersById.set(user.id, user)
      this.ticketsFromPoints.push(ticket)
      return
    }
    // regular ticket
    this.ticketsFromChat = this.ticketsFromChat.filter((t) => t.owner_id !== user.id)
    this.usersById.set(user.id, user)
    this.ticketsFromChat.push(ticket)
  }

  start = () => {
    this.gameState = 'playing'
  }

  displayNextNumber = $state<string>('')
  isRolling = $state(false)

  rollNextNumber = async () => {
    if (this.drawPool.length === 0 || this.isRolling) return

    const randomIndex = Math.floor(Math.random() * this.drawPool.length)
    const rolledNumber = this.drawPool[randomIndex]

    this.isRolling = true
    this.displayNextNumber = rolledNumber

    // Wait for the animation to complete
    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.isRolling = false
    this.nextNumber = rolledNumber
    this.drawnNumbers.push(rolledNumber)
    this.drawPool = this.drawPool.filter((_, i) => i !== randomIndex)
  }
}

function getTicketMatchScore(ticket: LotoTicket, drawnSet: SvelteSet<string>) {
  const matches = ticket.value.map((n) => drawnSet.has(n))

  let maxSeq = 0
  let currentSeq = 0
  for (const m of matches) {
    if (m) {
      currentSeq++
      maxSeq = Math.max(maxSeq, currentSeq)
    } else {
      currentSeq = 0
    }
  }

  let gapMatches = 0
  for (let i = 0; i < matches.length - 2; i++) {
    if (matches[i] && !matches[i + 1] && matches[i + 2]) {
      gapMatches++
    }
  }

  const totalMatches = matches.filter(Boolean).length

  // Weighting:
  // maxSeq is most important (e.g. * 1000)
  // gapMatches is next (e.g. * 100)
  // totalMatches is next (e.g. * 1)
  return maxSeq * 1000 + gapMatches * 100 + totalMatches
}

function makeTicket(params: {
  chatMessage: ChatMessage
  pool: string[]
  config: LotoConfig
}): LotoTicket {
  const { chatMessage, pool, config } = params

  const ticketNumber = genTicketNumber({
    text: chatMessage.message,
    pool,
    config
  })
  return {
    id: `${chatMessage.user.id}-${chatMessage.id}` as LotoTicketId,
    owner_id: chatMessage.user.id,
    owner_name: chatMessage.user.username,
    value: ticketNumber,
    color: 'random',
    variant: 1,
    type: 'chat',
    source: chatMessage.source,
    created_at: chatMessage.ts,
    isLatecomer: false
  }
}

function genTicketNumber(params: { text: string; pool: string[]; config: LotoConfig }): string[] {
  const { pool, config } = params

  const text = params.text.trim()
  if (text.length === 0) {
    return sampleSize(pool, config.ticketSize)
  }

  const ticketNumber = uniq(
    text
      .split(' ')
      .map((n) => parseInt(n))
      .filter((n) => n > 0 && n < config.maxNumber)
      .map((n) => n.toString().padStart(2, '0'))
      .filter((n) => pool.includes(n))
  )

  if (ticketNumber.length < config.ticketSize) {
    const sampleOptions = sampleSize(pool, 10)
    const validOptions = sampleOptions.filter((o) => !ticketNumber.includes(o))
    ticketNumber.push(...sampleSize(validOptions, config.ticketSize - ticketNumber.length))
  }

  return ticketNumber.slice(0, config.ticketSize)
}

const VK_CHAT_BOT_NAME = 'ChatBot'

function isMessageFromVkBot(msg: ChatMessage) {
  return msg.source.server === 'vkvideo' && msg.user.username === VK_CHAT_BOT_NAME
}

function isMessageHighlightedOnTwitch(msg: ChatMessage) {
  return msg.source.server === 'twitch' && Boolean(msg.user.twitch_fields?.highlighted)
}
