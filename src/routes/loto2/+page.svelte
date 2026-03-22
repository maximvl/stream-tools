<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { getStore } from '$lib/context'
  import { LotoStore } from '$lib/stores/lotoStore.svelte'

  import { untrack } from 'svelte'

  import LotoTicket from '$lib/components/loto/LotoTicket.svelte'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'

  const lotoStore = new LotoStore({
    maxNumber: 99,
    ticketSize: 8
  })

  const store = getStore()

  $effect(() => {
    const messages = store.newMessages
    untrack(() => {
      messages.forEach(lotoStore.addTicket)
    })
  })
</script>

<div class="flex flex-col gap-6 p-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-black tracking-tighter uppercase italic">Loto</h1>
    <ConnectionDialog />
  </div>

  <div class="flex flex-wrap gap-4">
    {#each lotoStore.ticketsOrdered as ticket (ticket.id)}
      <div animate:flip={{ duration: 400 }} in:fade>
        <LotoTicket {ticket} matchedNumbers={lotoStore.drawnNumbers} />
      </div>
    {/each}
  </div>
</div>
