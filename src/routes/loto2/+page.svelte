<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { getStore } from '$lib/context'
  import { LotoStore } from '$lib/stores/lotoStore.svelte'

  import { untrack } from 'svelte'

  import LotoTicket from '$lib/components/loto/LotoTicket.svelte'
  import { Button } from '$lib/components/ui/button'
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
    <h1 class="text-3xl font-black tracking-tighter text-primary uppercase italic">Loto</h1>
    <div class="flex items-center gap-4">
      {#if lotoStore.gameState === 'registration'}
        <Button
          class="h-auto rounded-xl bg-green-600 px-8 py-3.5 font-black uppercase tracking-tighter shadow-xl transition-all hover:scale-[1.02] hover:bg-green-500 active:scale-95"
          onclick={() => lotoStore.start()}
        >
          Start Loto
        </Button>
      {:else}
        <div
          class="flex items-center gap-3 rounded-xl border bg-card p-2 px-4 shadow-sm ring-1 ring-border/50"
        >
          <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase"
            >Last:</span
          >
          <span class="min-w-[3rem] text-center text-3xl font-black text-primary">
            {lotoStore.nextNumber || '--'}
          </span>
        </div>
        <Button
          class="h-auto rounded-xl px-8 py-3.5 font-black uppercase tracking-tighter shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          onclick={() => lotoStore.rollNextNumber()}
          disabled={lotoStore.drawPool.length === 0}
        >
          Roll Number
        </Button>
      {/if}
      <ConnectionDialog />
    </div>
  </div>

  {#if lotoStore.drawnNumbers.length > 0}
    <div class="flex flex-col gap-3 rounded-2xl border border-border/50 bg-muted/30 p-4">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-xs font-black tracking-[0.2em] text-muted-foreground uppercase">
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
