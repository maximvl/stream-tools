import { SvelteMap } from 'svelte/reactivity'
import { LocalStore } from './localStore.svelte'
import type { ChatMessage, UserId } from '$lib/types'
import { createContext } from 'svelte'

export type VoteOption = {
  id: string
  text: string
}

export type Vote = {
  userId: UserId
  username: string
  optionIndex: number
  timestamp: number
}

export type VotingState = 'idle' | 'voting' | 'ended'

export class VotingStore {
  optionsStore: LocalStore<VoteOption[]>
  votingState = $state<VotingState>('idle')
  votes = $state<SvelteMap<UserId, Vote>>(new SvelteMap())

  constructor() {
    this.optionsStore = new LocalStore<VoteOption[]>('voting-options', [
      { id: crypto.randomUUID(), text: 'Вариант 1' },
      { id: crypto.randomUUID(), text: 'Вариант 2' },
    ])
  }

  // Getters for options
  get options(): VoteOption[] {
    return this.optionsStore.value
  }

  set options(val: VoteOption[]) {
    this.optionsStore.value = val
  }

  addOption(text = '') {
    this.optionsStore.value.push({
      id: crypto.randomUUID(),
      text,
    })
  }

  removeOption(index: number) {
    if (this.optionsStore.value.length > 2) {
      this.optionsStore.value = this.optionsStore.value.filter((_, idx) => idx !== index)
    }
  }

  updateOption(index: number, text: string) {
    if (this.optionsStore.value[index]) {
      this.optionsStore.value[index].text = text
    }
  }

  startVoting() {
    this.votes = new SvelteMap()
    this.votingState = 'voting'
  }

  endVoting() {
    this.votingState = 'ended'
  }

  resetVoting() {
    this.votes = new SvelteMap()
    this.votingState = 'idle'
  }

  handleMessage = (msg: ChatMessage) => {
    if (this.votingState !== 'voting') return

    const messageText = msg.message.trim()
    const num = parseInt(messageText, 10)

    // Check if the message is exactly the number of one of the options
    if (!isNaN(num) && num >= 1 && num <= this.options.length) {
      this.votes.set(msg.user.id, {
        userId: msg.user.id,
        username: msg.user.username,
        optionIndex: num - 1,
        timestamp: msg.ts,
      })
    }
  }

  // Derived properties
  totalVotes = $derived(this.votes.size)

  votesPerOption = $derived.by(() => {
    const counts = this.options.map(() => 0)
    this.votes.forEach((vote) => {
      if (vote.optionIndex >= 0 && vote.optionIndex < this.options.length) {
        counts[vote.optionIndex]++
      }
    })
    return counts
  })

  optionStats = $derived.by(() => {
    const total = this.totalVotes
    return this.options.map((option, idx) => {
      const count = this.votesPerOption[idx] || 0
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
      return {
        ...option,
        count,
        percentage,
      }
    })
  })

  // Sorted options by vote count (for ended state)
  sortedStats = $derived.by(() => {
    return [...this.optionStats].sort((a, b) => b.count - a.count)
  })

  // Winners (highest vote count)
  winners = $derived.by(() => {
    if (this.totalVotes === 0) return []
    const maxCount = Math.max(...this.votesPerOption)
    if (maxCount === 0) return []
    return this.optionStats.filter((opt) => opt.count === maxCount)
  })
}

export const [getVotingStore, setVotingStore] = createContext<VotingStore>()
