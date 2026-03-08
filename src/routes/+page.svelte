<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { getStore } from '$lib/context'

  const store = getStore()
</script>

<div class="dark">
  <ConnectionDialog />
  <h1>Chat messages</h1>
  <div class="flex gap-10">
    <div>
      {#each store.messages as message (message.id)}
        <div>{message.message}</div>
      {/each}
    </div>
  </div>
</div>
