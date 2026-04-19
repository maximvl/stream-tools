<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import LotoSettingsDialog from '$lib/components/loto/LotoSettingsDialog.svelte'
  import { getChatStore } from '$lib/context'
  import { getLotoConfigStore, LotoStore } from '$lib/stores/lotoStore.svelte'
  import { TimerStore } from '$lib/stores/timerStore.svelte'

  import { untrack } from 'svelte'

  import LotoTicket from '$lib/components/loto/LotoTicket.svelte'
  import LotoLogo from '$lib/components/loto/LotoLogo.svelte'
  import PlatformTicketCounts from '$lib/components/loto/PlatformTicketCounts.svelte'
  import SlotDigit from '$lib/components/loto/SlotDigit.svelte'
  import { Button } from '$lib/components/ui/button'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import Nav from '$lib/components/layout/Nav.svelte'

  const lotoConfig = getLotoConfigStore()
  const lotoStore = new LotoStore(lotoConfig)
  const store = getChatStore()
  const countdownTimer = new TimerStore()

  function addTime(seconds: number) {
    if (countdownTimer.state === 'finished') {
      countdownTimer.limitMs = 0
    }
    countdownTimer.limitMs += seconds * 1000
    if (countdownTimer.state !== 'active') {
      countdownTimer.start()
    }
  }

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
<div class="dark relative flex min-h-screen flex-col overflow-hidden p-6">
  <div class="fixed inset-0 -z-10">
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
    ></div>
    <div
      class="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
    ></div>
    <div
      class="absolute top-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-pink-500/20 blur-3xl"
      style="animation-delay: 1s;"
    ></div>
    <div
      class="absolute bottom-1/4 left-1/3 h-72 w-72 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
      style="animation-delay: 2s;"
    ></div>
    <div
      class="absolute right-1/3 bottom-0 h-64 w-64 animate-pulse rounded-full bg-orange-500/20 blur-3xl"
      style="animation-delay: 3s;"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl"
      style="animation-duration: 20s;"
    ></div>
  </div>

  <div class="fixed top-6 left-6 z-50 flex flex-col gap-4">
    <ConnectionDialog />
    <LotoSettingsDialog />
    {#if lotoStore.gameState === 'registration'}
      <div class="flex flex-col gap-2">
        <Button
          class="h-auto rounded-xl bg-blue-600 px-4 py-2 text-sm font-black tracking-tighter uppercase shadow-lg transition-all hover:scale-105 hover:bg-blue-500 active:scale-95"
          onclick={() => addTime(60)}
        >
          +1 мин
        </Button>
        <Button
          class="h-auto rounded-xl bg-purple-600 px-4 py-2 text-sm font-black tracking-tighter uppercase shadow-lg transition-all hover:scale-105 hover:bg-purple-500 active:scale-95"
          onclick={() => addTime(30)}
        >
          +30 сек
        </Button>
      </div>
    {:else}
      <PlatformTicketCounts tickets={lotoStore.ticketsOrdered} />
    {/if}
  </div>

  <div class="fixed top-6 right-8 z-50">
    <LotoLogo />
  </div>

  <div class="flex flex-1 flex-col items-center justify-center gap-8 pt-16">
    {#if lotoStore.gameState === 'registration'}
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-6">
          <Button
            class="{countdownTimer.state !== 'active'
              ? 'button-animate'
              : ''} h-auto rounded-xl bg-green-600 px-12 py-6 text-xl font-black tracking-tighter uppercase shadow-xl transition-all hover:scale-105 hover:bg-green-500 active:scale-95"
            onclick={() => lotoStore.start()}
          >
            Начать
          </Button>
          {#if countdownTimer.limitMs > 0}
            <div
              class="flex h-16 items-center justify-center rounded-2xl border-2 px-6 shadow-lg ring-1 transition-all {countdownTimer.remainingSeconds <=
              30
                ? 'animate-pulse border-red-500/50 bg-red-500/10 ring-red-500/20'
                : 'border-primary/20 bg-card ring-primary/5'}"
            >
              <div class="flex items-center gap-2">
                <div
                  class="text-3xl font-black {countdownTimer.remainingSeconds <= 30
                    ? 'text-red-500'
                    : 'text-primary'}"
                >
                  {Math.max(0, countdownTimer.remainingSeconds).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          {/if}
        </div>
        <div
          class="hidden animate-pulse text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase"
        >
          Раздача билетов {lotoStore.ticketsOrdered.length}
        </div>
        <PlatformTicketCounts tickets={lotoStore.ticketsOrdered} />
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
        <div animate:flip={{ duration: 700 }} in:fade>
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

<style>
  @keyframes pulse-size {
    0%,
    100% {
      scale: 1;
    }
    50% {
      scale: 1.1;
    }
  }

  :global(.button-animate) {
    animation: pulse-size 1s ease-in-out infinite;
  }
</style>
