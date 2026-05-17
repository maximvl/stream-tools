<script lang="ts">
  import { fetchLotoWinners, type LotoWinner } from '$lib/api'
  import { EZ_SMILE_IMG, GAGA_SMILE_IMG, ServerIcons } from '$lib/constants'
  import { getChatStore } from '$lib/context'
  import { type ChatServer } from '$lib/types'
  import { createQueries } from '@tanstack/svelte-query'
  import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

  const messagesStore = getChatStore()

  let winners = $state<LotoWinner[]>([])
  const winnersSorted = $derived.by(() => {
    return winners.toSorted((a, b) => b.created_at - a.created_at)
  })

  createQueries(() => {
    return {
      queries: messagesStore.connectedConnections.map((connKey) => {
        const [server, channel] = connKey.split('/')
        return {
          queryKey: ['loto-winners', server, channel],
          queryFn: async () => fetchLotoWinners(server, channel),
        }
      }),
      combine: (results) => {
        if (results && results.length > 0) {
          console.log({ results })
          winners = results.flatMap((result) => result?.data?.winners ?? [])
        }
        return results
      },
    }
  })
</script>

<div class="flex max-w-70 flex-col gap-2 rounded-lg bg-card p-2 z-1">
  <div>Прошлы победители</div>
  {#each winnersSorted as winner (winner.id)}
    {@const server = winner.stream_channel.split('/')[0] as ChatServer}
    <div class="flex items-center gap-2">
      <span class="text-lg font-bold">{winner.username}</span>
      <img
        src={ServerIcons[server]}
        alt={server}
        class="h-4 w-4 shrink-0 opacity-70 transition-opacity hover:opacity-100"
      />
      <Tooltip>
        <TooltipTrigger>
          {#if winner.super_game_status === 'win'}
            <img src={EZ_SMILE_IMG} class="h-6 w-6" alt="win" />
          {:else if winner.super_game_status === 'lose'}
            <img src={GAGA_SMILE_IMG} class="h-6 w-6" alt="lose" />
          {/if}
        </TooltipTrigger>
        <TooltipContent>
          {winner.super_game_status === 'win' ? 'Победил в супер-игре' : 'Проиграл в супер-игре'}
        </TooltipContent>
      </Tooltip>
    </div>
  {/each}
</div>
