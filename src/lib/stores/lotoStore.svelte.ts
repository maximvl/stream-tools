import type {
  ChatMessage,
  ChatUser,
  LotoTicket,
  LotoTicketId,
  UserId,
  VkMention,
  VkRewards,
} from '$lib/types'
import sampleSize from 'lodash/sampleSize'
import uniq from 'lodash/uniq'
import { SvelteMap, SvelteSet } from 'svelte/reactivity'
import { LocalStore } from './localStore.svelte'

type GameState = 'registration' | 'playing'
type SuperGameResultItem = 'empty' | 'x1' | 'x2' | 'x3' | { vk_custom: string }

const LOTO_MATCH = 'лото'

export type LotoConfig = {
  ticket_size: number
  max_number: number
  roll_animation_time: number
  enable_chat_tickets: boolean
  enable_points_tickets: boolean
  only_subscribers: boolean
  win_matches_amount: number
  manual_draw_enabled: boolean
  // limit_to_90: boolean
  allow_mods_to_input_numbers: boolean
  super_game_options_amount: number
  super_game_guesses_amount: number
  super_game_1_pointers: number
  super_game_2_pointers: number
  super_game_3_pointers: number
  super_game_bonus_guesses_enabled: boolean
  super_game_vk_rewards?: VkRewards
}

const DefaultConfig: LotoConfig = {
  ticket_size: 8,
  max_number: 99,
  roll_animation_time: 1500,
  enable_chat_tickets: true,
  enable_points_tickets: true,
  only_subscribers: false,
  win_matches_amount: 3,
  manual_draw_enabled: false,
  // limit_to_90: false,
  allow_mods_to_input_numbers: false,
  super_game_options_amount: 99,
  super_game_guesses_amount: 7,
  super_game_1_pointers: 3,
  super_game_2_pointers: 2,
  super_game_3_pointers: 1,
  super_game_bonus_guesses_enabled: true,
  super_game_vk_rewards: undefined,
}

export class LotoStore {
  config: LocalStore<LotoConfig>

  drawPool = $state<string[]>([])
  drawnNumbers = $state<string[]>([])
  gameState = $state<GameState>('registration')
  nextNumber = $state<string>('')

  displayNextNumber = $state<string>('')
  isRolling = $state(false)

  ticketsFromChat = $state<LotoTicket[]>([])
  ticketsFromPoints = $state<LotoTicket[]>([])

  superGameValues = $state<SuperGameResultItem[]>([])
  superGameGuesses = $state<number[]>([])
  superGameRevealedIds = $state<number[]>([])

  usersById = $state<SvelteMap<string, ChatUser>>(new SvelteMap())
  openedChats = $state<Set<UserId>>(new SvelteSet())

  constructor(config: LocalStore<LotoConfig>) {
    this.config = config
    this.drawPool = Array.from({ length: this.config.value.max_number }, (_, i) =>
      (i + 1).toString().padStart(2, '0'),
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

  winner = $derived.by(() => {
    if (this.ticketsOrdered.length === 0) return null
    const firstTicket = this.ticketsOrdered[0]
    const drawnSet = new SvelteSet(this.drawnNumbers)
    const matches = firstTicket.value.map((n) => drawnSet.has(n))
    const maxSeq = getMaxSequentialMatches(matches)

    if (maxSeq >= this.config.value.win_matches_amount) {
      return firstTicket
    }
    return null
  })

  addTicket = (msg: ChatMessage) => {
    if (!msg.message.toLowerCase().includes(LOTO_MATCH)) {
      return
    }

    const ticket = makeTicket({ chatMessage: msg, pool: this.drawPool, config: this.config.value })
    const user: ChatUser = {
      id: msg.user.id,
      source: msg.source,
      username: msg.user.username,
      twitch_fields: msg.user.twitch_fields,
      vk_fields: msg.user.vk_fields,
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

  rollNextNumber = async () => {
    if (this.drawPool.length === 0 || this.isRolling) return

    const randomIndex = Math.floor(Math.random() * this.drawPool.length)
    const rolledNumber = this.drawPool[randomIndex]

    this.isRolling = true
    this.displayNextNumber = rolledNumber

    // Wait for the animation to complete
    await new Promise((resolve) => setTimeout(resolve, this.config.value.roll_animation_time))

    this.isRolling = false
    this.nextNumber = rolledNumber
    this.drawnNumbers.push(rolledNumber)
    this.drawPool = this.drawPool.filter((_, i) => i !== randomIndex)
  }
}

function getMaxSequentialMatches(matches: boolean[]) {
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
  return maxSeq
}

function getTicketMatchScore(ticket: LotoTicket, drawnSet: SvelteSet<string>) {
  const matches = ticket.value.map((n) => drawnSet.has(n))

  const maxSeq = getMaxSequentialMatches(matches)

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
    config,
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
    isLatecomer: false,
  }
}

function genTicketNumber(params: { text: string; pool: string[]; config: LotoConfig }): string[] {
  const { pool, config } = params

  const text = params.text.trim()
  if (text.length === 0) {
    return sampleSize(pool, config.ticket_size)
  }

  const ticketNumber = uniq(
    text
      .split(' ')
      .map((n) => parseInt(n))
      .filter((n) => n > 0 && n < config.max_number)
      .map((n) => n.toString().padStart(2, '0'))
      .filter((n) => pool.includes(n)),
  )

  if (ticketNumber.length < config.ticket_size) {
    const sampleOptions = sampleSize(pool, 10)
    const validOptions = sampleOptions.filter((o) => !ticketNumber.includes(o))
    ticketNumber.push(...sampleSize(validOptions, config.ticket_size - ticketNumber.length))
  }

  return ticketNumber.slice(0, config.ticket_size)
}

const VK_CHAT_BOT_NAME = 'ChatBot'

function isMessageFromVkBot(msg: ChatMessage) {
  return msg.source.server === 'vkvideo' && msg.user.username === VK_CHAT_BOT_NAME
}

function isMessageHighlightedOnTwitch(msg: ChatMessage) {
  return msg.source.server === 'twitch' && Boolean(msg.user.twitch_fields?.highlighted)
}

export function getLotoConfigStore() {
  return new LocalStore('loto-config', DefaultConfig)
}
