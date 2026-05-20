<script lang="ts">
  import type { ChatServer } from '$lib/types'
  import { ServerIcons } from '$lib/constants'
  import { cn } from '$lib/utils'
  import type { LotoTicket } from './types'

  type Props = {
    tickets: LotoTicket[]
    class?: string
  }

  let { tickets, class: className }: Props = $props()

  const ticketsByPlatform = $derived.by(() => {
    const counts: Record<string, number> = {}
    tickets.forEach((ticket) => {
      const platform = ticket.source.server
      counts[platform] = (counts[platform] || 0) + 1
    })
    return counts
  })

  const platforms = $derived(
    Object.entries(ticketsByPlatform)
      .toSorted(([_, a], [__, b]) => b - a)
      .map(([key]) => key as ChatServer)
  )
</script>

<div class={cn('flex items-center gap-3', className)}>
  {#each platforms as platform (platform)}
    <div class="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-1.5">
      <img src={ServerIcons[platform]} alt={platform} class="h-4 w-4" />
      <span class="text-base font-bold text-muted-foreground">
        {ticketsByPlatform[platform]}
      </span>
    </div>
  {/each}
</div>
