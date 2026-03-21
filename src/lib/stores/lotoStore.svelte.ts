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
    this.drawPool = Array.from({ length: config.maxNumber }, (_, i) => i + 1)
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
        const score1 = this.getTicketMatchScore(t1, drawnSet)
        const score2 = this.getTicketMatchScore(t2, drawnSet)
        if (score1 !== score2) return score2 - score1
        return t1.created_at - t2.created_at
      })
      return allTickets
    }
  })

  getTicketMatchScore(ticket: LotoTicket, drawnSet: SvelteSet<string>) {
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
}
