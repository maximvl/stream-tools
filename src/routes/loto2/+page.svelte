<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import LotoSettingsDialog from '$lib/components/loto/LotoSettingsDialog.svelte'
  import { getChatStore } from '$lib/context'
  import { getLotoConfigStore, LotoStore } from '$lib/stores/lotoStore.svelte'

  import { untrack } from 'svelte'

  import LotoTicket from '$lib/components/loto/LotoTicket.svelte'
  import SlotDigit from '$lib/components/loto/SlotDigit.svelte'
  import { Button } from '$lib/components/ui/button'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import Nav from '$lib/components/layout/Nav.svelte'

  const lotoConfig = getLotoConfigStore()
  const lotoStore = new LotoStore(lotoConfig)
  const store = getChatStore()

  $effect(() => {
    const messages = store.newMessages
    untrack(() => {
      messages.forEach(lotoStore.addTicket)
    })
  })
</script>

<div class="dark flex flex-col items-center p-8">
  <Nav />
</div>
<div class="dark flex min-h-screen flex-col p-6">
  <div class="fixed top-6 left-6 z-50 flex flex-col gap-6">
    <ConnectionDialog />
    <LotoSettingsDialog />
  </div>

  <div class="fixed top-6 right-6 z-50">
    <h1 class="text-3xl font-black tracking-tighter text-primary uppercase italic">Loto</h1>
  </div>

  <div class="flex flex-1 flex-col items-center justify-center gap-8 pt-16">
    {#if lotoStore.gameState === 'registration'}
      <div class="flex flex-col items-center gap-4">
        <Button
          class="h-auto rounded-xl bg-green-600 px-12 py-6 text-xl font-black tracking-tighter uppercase shadow-xl transition-all hover:scale-105 hover:bg-green-500 active:scale-95"
          onclick={() => lotoStore.start()}
        >
          Начать
        </Button>
        <div
          class="animate-pulse text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase"
        >
          Раздача билетов {lotoStore.ticketsOrdered.length}
        </div>
      </div>
    {:else}
      {@const numStr = lotoStore.displayNextNumber || '00'}
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col items-center gap-4 md:flex-row">
          <div
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-lg ring-1 ring-primary/5"
          >
            <div class="flex gap-1">
              <SlotDigit
                target={numStr[0]}
                duration={lotoConfig.value.roll_animation_time}
                animationKey={lotoStore.isRolling ? lotoStore.displayNextNumber : null}
                direction="up"
                class="h-16 w-10 border-none shadow-none"
              />
              <SlotDigit
                target={numStr[1]}
                duration={lotoConfig.value.roll_animation_time}
                animationKey={lotoStore.isRolling ? lotoStore.displayNextNumber : null}
                direction="down"
                class="h-16 w-10 border-none shadow-none"
              />
            </div>
          </div>

          <Button
            class="h-auto rounded-2xl px-8 py-8 text-xl font-black tracking-tighter uppercase shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
            onclick={() => lotoStore.rollNextNumber()}
            disabled={lotoStore.drawPool.length === 0 || lotoStore.isRolling}
          >
            Ролл
          </Button>
        </div>

        {#if lotoStore.drawnNumbers.length > 0}
          <div
            class="flex max-w-2xl flex-col gap-3 rounded-2xl border border-border/50 bg-muted/20 p-4 shadow-inner"
          >
            <div class="flex items-center justify-center px-2">
              <h2 class="text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                Открыто ({lotoStore.drawnNumbers.length})
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

    <div class="flex flex-wrap justify-center gap-4">
      {#each lotoStore.ticketsOrdered as ticket (ticket.id)}
        <div animate:flip={{ duration: 400 }} in:fade>
          <LotoTicket
            {ticket}
            matchedNumbers={lotoStore.drawnNumbers}
            lastRolledNumber={lotoStore.drawnNumbers[lotoStore.drawnNumbers.length - 1]}
          />
        </div>
      {/each}
    </div>
  </div>
</div>
