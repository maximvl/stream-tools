import type { ChatUser, UserId } from '$lib/types'
import { SvelteSet } from 'svelte/reactivity'

type LotoStep = 'registration' | 'playing'
type SuperGameResultItem = 'empty' | 'x1' | 'x2' | 'x3' | { vk_custom: string }

export class LotoStore {
  drawPool = $state<number[]>([])
  drawnNumbers = $state<number[]>([])
  step = $state<LotoStep>('registration')
  nextNumber = $state<string>('')
  rollAnimationState = $state<'idle' | 'roll_start' | 'rolling'>('idle')

  superGameValues = $state<SuperGameResultItem[]>([])
  superGameGuesses = $state<number[]>([])
  superGameRevealedIds = $state<number[]>([])
  

  usersById = $state<Record<string, ChatUser>>({})
  openChats = $state<Set<UserId>>(new SvelteSet())

  reset() {
    this.drawPool = []
    this.drawnNumbers = []
    this.step = 'registration'
  }
}
