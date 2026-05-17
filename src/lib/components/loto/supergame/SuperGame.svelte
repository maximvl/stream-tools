<script lang="ts">
  import { getLotoStore } from '$lib/stores/lotoStore.svelte'
  import PlayerName from '../PlayerName.svelte'
  import SuperGameBox from './SuperGameBox.svelte'

  const lotoStore = getLotoStore()
  const user = $derived(
    lotoStore.winner ? lotoStore.usersById.get(lotoStore.winner.owner_id) : undefined,
  )
</script>

{#if lotoStore.winner}
  {#key lotoStore.winner}
    {#if lotoStore.superGameState === 'not_started'}
      <div
        class="rounded-xl border border-primary/20 bg-card px-6 py-3 shadow-lg ring-1 ring-primary/5"
      >
        <p class="text-base font-medium text-primary">
          для участия в супер-игре пиши в чат
          свои числа
        </p>
      </div>
    {:else}
      <div class="text-4xl font-bold">
        Супер-игра с <PlayerName {user} name={lotoStore.winner.owner_name} />
      </div>
      <div class="flex flex-col gap-2 rounded-lg bg-card p-4">
        <div class="text-center text-xl">
          <span>Очки&nbsp;</span>
          {lotoStore.superGameScore}/{lotoStore.config.value.super_game_win_score}
        </div>
        <div class="flex items-center gap-2">
          {#each Array.from({ length: lotoStore.superGameTotalGuessesAmount }, (_, i) => i) as id (id)}
            {@const guess = lotoStore.superGameGuesses[id]}
            {@const status = guess
              ? lotoStore.superGameRevealedIds.includes(guess - 1)
                ? lotoStore.superGameValues[guess - 1].kind === 'empty'
                  ? 'empty'
                  : 'score'
                : 'hidden'
              : 'hidden'}
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-mono text-lg data-[status=empty]:bg-red-700 data-[status=score]:bg-green-800"
              data-status={status}
            >
              {(guess ?? '__').toString().padStart(2, '0')}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <SuperGameBox />
  {/key}
{/if}
