<script lang="ts">
  import RewardItem from './RewardItem.svelte'
  import { getLotoStore } from '$lib/stores/lotoStore.svelte'
  import Flipper from './Flipper.svelte'

  const lotoStore = getLotoStore()
</script>

<div class="border-red flex w-[630px] gap-2 flex-wrap justify-center border-5 text-center">
  {#each lotoStore.superGameValues as value, idx (idx)}
    {#snippet empty()}
      <div class="round-container flex h-12 w-12 items-center justify-center">{idx}</div>
    {/snippet}
    {#snippet content()}
      <RewardItem class="round-container h-12 w-12 p-1" reward={value} vkRoles={[]} />
    {/snippet}
    <Flipper oneShot class="h-12 w-12" {empty} {content} />
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