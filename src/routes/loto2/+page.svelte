<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { getStore } from '$lib/context'
  import { LotoStore } from '$lib/stores/lotoStore.svelte'

  import { untrack } from 'svelte'

  import LotoTicket from '$lib/components/loto/LotoTicket.svelte'
  import SlotDigit from '$lib/components/loto/SlotDigit.svelte'
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

<div class="flex min-h-screen flex-col gap-8 p-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-black tracking-tighter text-primary uppercase italic">Loto</h1>
    <ConnectionDialog />
  </div>

  <div class="flex flex-col items-center justify-center gap-8 py-8">
    {#if lotoStore.gameState === 'registration'}
      <div class="flex flex-col items-center gap-4">
        <Button
          class="h-auto rounded-xl bg-green-600 px-12 py-6 text-xl font-black tracking-tighter uppercase shadow-xl transition-all hover:scale-105 hover:bg-green-500 active:scale-95"
          onclick={() => lotoStore.start()}
        >
          Start Loto Game
        </Button>
        <div
          class="animate-pulse text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase"
        >
          Waiting for players to join...
        </div>
      </div>
    {:else}
      {@const numStr = lotoStore.displayNextNumber || '00'}
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col items-center gap-4 md:flex-row">
          <div
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-lg ring-1 ring-primary/5"
          >
            <span class="mb-2 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase"
              >Last</span
            >
            <div class="flex gap-1">
              <SlotDigit
                target={numStr[0]}
                animationKey={lotoStore.isRolling ? lotoStore.displayNextNumber : null}
                direction="up"
                class="h-16 w-10 border-none shadow-none"
              />
              <SlotDigit
                target={numStr[1]}
                animationKey={lotoStore.isRolling ? lotoStore.displayNextNumber : null}
                direction="down"
                class="h-16 w-10 border-none shadow-none"
              />
            </div>
          </div>

          <Button
            class="h-auto rounded-2xl px-8 py-8 text-xl font-black uppercase tracking-tighter shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
            onclick={() => lotoStore.rollNextNumber()}
            disabled={lotoStore.drawPool.length === 0 || lotoStore.isRolling}
          >
            Roll Next
          </Button>
        </div>

        {#if lotoStore.drawnNumbers.length > 0}
          <div
            class="flex max-w-2xl flex-col gap-3 rounded-2xl border border-border/50 bg-muted/20 p-4 shadow-inner"
          >
            <div class="flex items-center justify-center px-2">
              <h2 class="text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                History ({lotoStore.drawnNumbers.length})
              </h2>
            </div>
            <div class="flex flex-wrap justify-center gap-2">
              {#each lotoStore.drawnNumbers as num (num)}
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/10 bg-background text-sm font-black text-primary shadow-sm"
                  in:fade={{ duration: 300 }}
                >
                  {num}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="flex flex-wrap justify-center gap-4">
    {#each lotoStore.ticketsOrdered as ticket (ticket.id)}
      <div animate:flip={{ duration: 400 }} in:fade>
        <LotoTicket {ticket} matchedNumbers={lotoStore.drawnNumbers} />
      </div>
    {/each}
  </div>
</div>
