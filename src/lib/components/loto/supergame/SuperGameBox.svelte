<script lang="ts">
    import RewardItem from './RewardItem.svelte'
    import { getLotoStore } from '$lib/stores/lotoStore.svelte'

  const lotoStore = getLotoStore()
</script>

<div class="flex justify-center flex-wrap text-center gap-[10px] w-[630px] border-red border-5">
    {#each lotoStore.superGameValues as value, idx (idx)}
        <RewardItem reward={value} vkRoles={[]} />
    {/each}
</div>