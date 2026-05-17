<script lang="ts">
  import RewardItem from './RewardItem.svelte'
  import { getLotoStore } from '$lib/stores/lotoStore.svelte'
  import Flipper from './Flipper.svelte'
  import { cn } from '$lib/utils'

  const lotoStore = getLotoStore()
  const revealAll = $derived(lotoStore.superGameState === 'finished')
</script>

<div class="flex w-[600px] flex-wrap justify-center gap-2 text-center">
  {#each lotoStore.superGameValues as value, idx (idx)}
    {@const active = lotoStore.superGameGuesses.includes(idx + 1)}
    {@const highlighted = lotoStore.superGameState === 'not_started' || active}
    {#snippet hidden()}
      <div
        class={cn(
          'round-container flex h-12 w-12 items-center justify-center',
          highlighted ? '' : 'brightness-50',
        )}
      >
        {(idx + 1).toString().padStart(2, '0')}
      </div>
    {/snippet}
    {#snippet revealed()}
      <RewardItem
        class={cn('round-container h-12 w-12 p-1', highlighted ? '' : 'brightness-50')}
        reward={value}
        vkRoles={[]}
        emptyPlaceholder={active ? '' : (idx + 1).toString().padStart(2, '0')}
      />
    {/snippet}
    <Flipper
      oneShot
      class={cn('h-12 w-12', active ? '' : 'pointer-events-none')}
      hidden={revealAll ? revealed : hidden}
      revealed={revealed}
      onFlip={() => {
        lotoStore.superGameRevealedIds.push(idx)
      }}
    />
  {/each}
</div>

<style>
  :global(.round-container) {
    border-radius: 50%;
    border: 2px solid #e24040;
    background: #f4e1c7;
    font-family: monospace;
    font-size: 1.3rem;
  }
</style>
