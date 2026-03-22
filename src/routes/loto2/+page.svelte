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
    <h1 class="text-3xl font-black uppercase italic tracking-tighter text-primary">Loto</h1>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3 rounded-xl border bg-card p-2 px-4 shadow-sm ring-1 ring-border/50">
        <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last:</span>
        <span class="text-3xl font-black text-primary min-w-[3rem] text-center">
          {lotoStore.nextNumber || '--'}
        </span>
      </div>
      <button
        class="rounded-xl bg-primary px-8 py-3.5 font-black text-primary-foreground shadow-xl transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-30 uppercase tracking-tighter"
        onclick={() => lotoStore.rollNextNumber()}
        disabled={lotoStore.drawPool.length === 0}
      >
        Roll Number
      </button>
      <ConnectionDialog />
    </div>
  </div>

  {#if lotoStore.drawnNumbers.length > 0}
    <div class="flex flex-col gap-3 rounded-2xl bg-muted/30 p-4 border border-border/50">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
          Drawn Numbers ({lotoStore.drawnNumbers.length})
        </h2>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each lotoStore.drawnNumbers as num (num)}
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-background text-base font-black text-primary shadow-sm"
            in:fade={{ duration: 300 }}
          >
            {num}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="flex flex-wrap gap-4">
    {#each lotoStore.ticketsOrdered as ticket (ticket.id)}
      <div animate:flip={{ duration: 400 }} in:fade>
        <LotoTicket {ticket} matchedNumbers={lotoStore.drawnNumbers} />
      </div>
    {/each}
  </div>
</div>
