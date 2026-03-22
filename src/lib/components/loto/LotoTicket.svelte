<script lang="ts">
  import type { LotoTicket } from '$lib/types'
  import { cn } from '$lib/utils'

  type Props = {
    ticket: LotoTicket
    matchedNumbers?: string[]
    class?: string
  }

  let { ticket, matchedNumbers = [], class: className }: Props = $props()

  const isMatched = (num: string) => matchedNumbers.includes(num)
</script>

<div
  class={cn(
    'flex w-fit flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md',
    ticket.type === 'points' && 'border-yellow-500/30 bg-yellow-500/5',
    className
  )}
>
  <div class="flex items-center justify-between gap-4">
    <span class="truncate font-bold text-primary">
      {ticket.owner_name}
    </span>
    {#if ticket.type === 'points'}
      <span
        class="shrink-0 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-black tracking-wider text-yellow-600 uppercase"
      >
        Бонус
      </span>
    {/if}
  </div>

  <div class="flex flex-nowrap gap-1.5">
    {#each ticket.value as num (num)}
      <div
        class={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-black transition-all duration-300',
          isMatched(num)
            ? 'scale-105 border-yellow-400 bg-yellow-400 text-yellow-950 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
            : 'border-muted bg-muted/30 text-muted-foreground'
        )}
      >
        {num}
      </div>
    {/each}
  </div>
</div>
