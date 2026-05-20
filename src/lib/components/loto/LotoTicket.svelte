<script lang="ts">
  import type { ChatServer, ChatUser } from '$lib/types'
  import { cn } from '$lib/utils'
  import PlayerName from './PlayerName.svelte'
  import UserBadges from './UserBadges.svelte'
  import { ServerIcons } from '$lib/constants'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import type { LotoTicket } from './types'
  import { TrophyIcon } from '@lucide/svelte'
  import { getLotoStore } from '$lib/stores/lotoStore.svelte'

  type Props = {
    ticket: LotoTicket
    user: ChatUser
    matchedNumbers?: string[]
    lastRolledNumber?: string
    winnerMatchedNumbers?: string[]
    class?: string
    showTimestamp?: boolean
  }

  let {
    ticket,
    user,
    matchedNumbers = [],
    lastRolledNumber,
    winnerMatchedNumbers = [],
    class: className,
    showTimestamp = false,
  }: Props = $props()

  const isMatched = (num: string) => matchedNumbers.includes(num)
  const isLastRolledMatch = (num: string) => num === lastRolledNumber
  const isWinnerMatch = (num: string) => winnerMatchedNumbers.includes(num)

  const lotoStore = getLotoStore()

  const userWinsTimestamps = $derived(lotoStore.winsByUser[ticket.owner_name] || [])

  const ticketSource = $derived(`${ticket.source.server}/${ticket.source.channel}`)

  // Hash function to convert username to a number
  function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Ticket style options
  const ticketStyles = [
    {
      // Style 0: Purple gradient
      border: 'border-purple-500/50',
      bg: 'bg-gradient-to-br from-purple-500/25 to-purple-900/25',
      shadow: 'shadow-purple-500/40',
      glow: 'hover:shadow-purple-500/50',
    },
    {
      // Style 1: Blue gradient
      border: 'border-blue-500/50',
      bg: 'bg-gradient-to-br from-blue-500/25 to-blue-900/25',
      shadow: 'shadow-blue-500/40',
      glow: 'hover:shadow-blue-500/50',
    },
    {
      // Style 2: Pink gradient
      border: 'border-pink-500/50',
      bg: 'bg-gradient-to-br from-pink-500/25 to-pink-900/25',
      shadow: 'shadow-pink-500/40',
      glow: 'hover:shadow-pink-500/50',
    },
    {
      // Style 3: Green gradient
      border: 'border-green-500/50',
      bg: 'bg-gradient-to-br from-green-500/25 to-green-900/25',
      shadow: 'shadow-green-500/40',
      glow: 'hover:shadow-green-500/50',
    },
    {
      // Style 4: Orange gradient
      border: 'border-orange-500/50',
      bg: 'bg-gradient-to-br from-orange-500/25 to-orange-900/25',
      shadow: 'shadow-orange-500/40',
      glow: 'hover:shadow-orange-500/50',
    },
    {
      // Style 5: Cyan gradient
      border: 'border-cyan-500/50',
      bg: 'bg-gradient-to-br from-cyan-500/25 to-cyan-900/25',
      shadow: 'shadow-cyan-500/40',
      glow: 'hover:shadow-cyan-500/50',
    },
    {
      // Style 6: Rose gradient
      border: 'border-rose-500/50',
      bg: 'bg-gradient-to-br from-rose-500/25 to-rose-900/25',
      shadow: 'shadow-rose-500/40',
      glow: 'hover:shadow-rose-500/50',
    },
    {
      // Style 7: Indigo gradient
      border: 'border-indigo-500/50',
      bg: 'bg-gradient-to-br from-indigo-500/25 to-indigo-900/25',
      shadow: 'shadow-indigo-500/40',
      glow: 'hover:shadow-indigo-500/50',
    },
  ]

  // Select style based on username
  const selectedStyle = $derived(ticketStyles[hashString(user.username) % ticketStyles.length])

  function formatTime(timestamp: number) {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const parts = formatter.formatToParts(new Date(timestamp * 1000))
    return parts
      .filter((p) => p.type !== 'literal' || p.value.trim() !== 'г.')
      .map((p) => (p.value.endsWith('.') ? p.value.slice(0, -1) : p.value))
      .join('')
  }
</script>

<div
  class={cn(
    'flex w-fit flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all',
    cn(selectedStyle.border, selectedStyle.bg, selectedStyle.shadow, selectedStyle.glow),
    className,
  )}
>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <UserBadges {user} />
      <PlayerName {user} name={ticket.owner_name} class="truncate" />
    </div>
    <div class="flex items-center gap-2">
      {#if ticket.type === 'points'}
        <span
          class="shrink-0 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-black tracking-wider text-yellow-600 uppercase"
        >
          Бонус
        </span>
      {/if}
      {#if userWinsTimestamps.length > 0}
        <Tooltip.Root>
          <Tooltip.Trigger>
            <div
              class="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-gradient-to-b from-yellow-500/20 to-yellow-700/10 px-3 py-1 text-yellow-200 shadow"
            >
              <TrophyIcon class="h-4 w-4" />
              <span class="font-bold">{userWinsTimestamps.length}</span>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <div class="flex flex-col gap-2">
              <p>Выигрывал {userWinsTimestamps.length} раз</p>
              {#each userWinsTimestamps as winner (winner.id)}
                {@const server = winner.stream_channel.split('/')[0]}
                <div class="flex items-center gap-2">
                  <div>{formatTime(winner.created_at)}</div>
                  <img src={ServerIcons[server as ChatServer]} alt={server} class="h-4 w-4" />
                </div>
              {/each}
            </div>
          </Tooltip.Content>
        </Tooltip.Root>
      {/if}
      <Tooltip.Root>
        <Tooltip.Trigger>
          <img
            src={ServerIcons[ticket.source.server]}
            alt={ticket.source.server}
            class="h-4 w-4 shrink-0 opacity-70 transition-opacity hover:opacity-100"
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{ticketSource}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </div>

  <div class="flex flex-nowrap gap-1.5">
    {#each ticket.value as num, id (id)}
      <div
        class={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-black transition-all duration-300',
          isWinnerMatch(num)
            ? 'scale-110 border-green-500 bg-green-500 text-green-950 shadow-[0_0_15px_rgba(34,197,94,0.7)]'
            : isLastRolledMatch(num)
              ? 'scale-110 border-orange-500 bg-orange-500 text-orange-950 shadow-[0_0_15px_rgba(249,115,22,0.7)]'
              : isMatched(num)
                ? 'scale-105 border-yellow-400 bg-yellow-400 text-yellow-950 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                : 'border-white/40 bg-white/10 text-white/90',
        )}
      >
        {num}
      </div>
    {/each}
  </div>
  {#if showTimestamp}
    <div class="text-sm text-white/60">
      Выдан {new Date(ticket.created_at).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: 'numeric',
        fractionalSecondDigits: 3,
        hour12: false,
      })}
    </div>
  {/if}
</div>
