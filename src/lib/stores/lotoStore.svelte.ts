import type { ChatUser, LotoTicket, UserId } from '$lib/types'
import { SvelteSet } from 'svelte/reactivity'

type GameState = 'registration' | 'playing'
type SuperGameResultItem = 'empty' | 'x1' | 'x2' | 'x3' | { vk_custom: string }

export type LotoConfig = {
  maxNumber: number
}

export class LotoStore {
  drawPool = $state<number[]>([])
  drawnNumbers = $state<string[]>([])
  gameState = $state<GameState>('registration')
  nextNumber = $state<string>('')
  rollAnimationState = $state<'idle' | 'roll_start' | 'rolling'>('idle')

  ticketsFromChat = $state<LotoTicket[]>([])
  ticketsFromPoints = $state<LotoTicket[]>([])

  superGameValues = $state<SuperGameResultItem[]>([])
  superGameGuesses = $state<number[]>([])
  superGameRevealedIds = $state<number[]>([])

  usersById = $state<Record<string, ChatUser>>({})
  openChats = $state<Set<UserId>>(new SvelteSet())

  constructor(config: LotoConfig) {
    // TODO init draw pool with numbers 1 to config.maxNumber
  }

  ticketsOrdered = $derived.by(() => {
    if (this.gameState === 'registration') {
      const allTickets = [...this.ticketsFromChat, ...this.ticketsFromPoints]
      allTickets.sort((t1, t2) => t2.created_at - t1.created_at)
      return allTickets
    }
    if (this.gameState === 'playing') {
      const allTickets = [...this.ticketsFromChat, ...this.ticketsFromPoints]

      allTickets.sort()
      return allTickets
    }
  })

  getTicketMatchScore(ticket: LotoTicket, drawnNumbers: number[]) {
    // TODO return score used to compare tickets
    // the score should be high in this order
    // 1. amount of sequential matches in ticket
    // 2. amount of matches separated by 1 place potentially connecting them on next draw
    // 3. total amount of matches
    // 4. rest by creation date
  }
}
