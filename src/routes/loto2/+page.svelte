<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { getStore } from '$lib/context'
  import { LotoStore } from '$lib/stores/lotoStore.svelte'

  import { untrack } from 'svelte'

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

<div>
  <ConnectionDialog />
  <div>Tickets</div>
  <div>
    {#each lotoStore.ticketsOrdered as ticket (ticket.id)}
      <div>
        <div>{ticket.owner_name}</div>
        <div>{ticket.value}</div>
      </div>
    {/each}
  </div>
</div>
