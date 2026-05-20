<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import Nav from '$lib/components/layout/Nav.svelte'
  import { Input } from '$lib/components/ui/input'
  import { Button } from '$lib/components/ui/button'
  import { getChatStore } from '$lib/context'
  import { VotingStore, setVotingStore } from '$lib/stores/votingStore.svelte'
  import { untrack } from 'svelte'

  const chatStore = getChatStore()
  const votingStore = new VotingStore()
  setVotingStore(votingStore)

  $effect(() => {
    const messages = chatStore.newMessages
    untrack(() => {
      messages.forEach(votingStore.handleMessage)
    })
  })
</script>

<svelte:head>
  <title>Голосование: {votingStore.votingState === 'voting' ? `${votingStore.totalVotes} голосов` : 'Настройка'}</title>
</svelte:head>

<div class="dark flex flex-col items-center p-8">
  <Nav />
</div>

<div class="dark relative flex min-h-screen flex-col overflow-hidden p-6 pt-0">
  <!-- Animated Background Gradients -->
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

  <div class="mb-12 flex w-full max-w-6xl items-center self-center">
    <div class="w-[250px]">
      <ConnectionDialog />
    </div>
    <div class="flex-1 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight">Голосование</h1>
    </div>
    <div class="w-[250px]"></div>
  </div>

  <div class="flex flex-1 flex-col items-center justify-start gap-8">
    {#if votingStore.votingState === 'idle'}
      <!-- IDLE / CONFIGURATION STATE -->
      <div class="w-full max-w-xl rounded-3xl border border-primary/20 bg-card p-8 shadow-2xl backdrop-blur-md">
        <h2 class="mb-2 text-2xl font-black text-primary uppercase">Настройка вариантов</h2>
        <p class="mb-6 text-sm text-muted-foreground">
          Укажите варианты ответа. Во время голосования зрители смогут отправлять в чат порядковый номер варианта (1, 2, 3...) для участия.
        </p>

        <div class="flex flex-col gap-3">
          {#each votingStore.options as option, index (option.id)}
            <div class="flex items-center gap-2">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 font-bold border border-border">
                {index + 1}
              </span>
              <Input
                type="text"
                placeholder="Текст варианта..."
                value={option.text}
                oninput={(e) => votingStore.updateOption(index, e.currentTarget.value)}
              />
              {#if votingStore.options.length > 2}
                <Button
                  variant="destructive"
                  size="icon"
                  onclick={() => votingStore.removeOption(index)}
                  class="shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </Button>
              {/if}
            </div>
          {/each}
        </div>

        <Button
          variant="outline"
          class="w-full mt-4 gap-2 border-primary/20 hover:bg-primary/5 rounded-xl"
          onclick={() => votingStore.addOption()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Добавить вариант
        </Button>

        <Button
          class="w-full mt-8 bg-green-600 hover:bg-green-500 font-black text-lg py-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
          onclick={() => votingStore.startVoting()}
        >
          Начать голосование
        </Button>
      </div>
    {:else if votingStore.votingState === 'voting'}
      <!-- VOTING IN PROGRESS STATE -->
      <div class="mb-8 w-full max-w-xl rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md px-8 py-6 shadow-lg ring-1 ring-primary/5 text-center">
        <p class="text-xl font-extrabold text-primary tracking-wide uppercase">
          Идет голосование!
        </p>
        <p class="text-sm text-muted-foreground mt-2">
          Напишите в чат цифру <span class="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">1, 2, 3...</span> чтобы отдать свой голос
        </p>
        <div class="mt-4 flex items-center justify-center gap-2">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span class="text-sm font-bold text-muted-foreground">Всего голосов: {votingStore.totalVotes}</span>
        </div>
      </div>

      <div class="w-full max-w-3xl flex flex-col gap-4">
        {#each votingStore.optionStats as stat, index (stat.id)}
          <div class="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xs p-5 shadow-sm transition-all hover:border-primary/30">
            <!-- Animated Progress Bar -->
            <div
              class="absolute inset-y-0 left-0 -z-10 bg-primary/15 transition-all duration-500 ease-out"
              style="width: {stat.percentage}%"
            ></div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 font-black text-primary text-xl border border-primary/20 shadow-inner">
                  {index + 1}
                </span>
                <div>
                  <p class="text-xl font-bold text-foreground">{stat.text || `Вариант ${index + 1}`}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-black text-primary">{stat.percentage}%</p>
                <p class="text-xs text-muted-foreground font-semibold">{stat.count} голосов</p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="flex gap-4 mt-8 justify-center">
        <Button
          variant="outline"
          class="px-8 py-5 text-sm rounded-xl font-semibold border-destructive/30 text-destructive hover:bg-destructive/10"
          onclick={() => votingStore.resetVoting()}
        >
          Сбросить
        </Button>
        <Button
          class="px-10 py-5 text-sm bg-purple-600 hover:bg-purple-500 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
          onclick={() => votingStore.endVoting()}
        >
          Завершить
        </Button>
      </div>
    {:else if votingStore.votingState === 'ended'}
      <!-- VOTING ENDED / RESULTS STATE -->
      <div class="mb-8 w-full max-w-xl rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md px-8 py-6 shadow-lg text-center flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-yellow-500 mb-3 animate-bounce"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 22V18" />
          <path d="M14 22V18" />
          <path d="M18 4H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
          <path d="M12 11V18" />
        </svg>
        <p class="text-xl font-extrabold text-yellow-500 tracking-wide uppercase">
          Результаты голосования
        </p>
        <p class="text-sm text-muted-foreground mt-1">
          Голосование завершено. Всего собрано голосов: {votingStore.totalVotes}
        </p>
      </div>

      <div class="w-full max-w-3xl flex flex-col gap-4">
        {#each votingStore.sortedStats as stat, index (stat.id)}
          {@const isWinner = votingStore.winners.some((w) => w.id === stat.id)}
          <div class="relative overflow-hidden rounded-2xl border transition-all p-5 {isWinner ? 'border-yellow-500/50 bg-yellow-500/5 shadow-lg shadow-yellow-500/5 ring-1 ring-yellow-500/20' : 'border-border/50 bg-card/20'}">
            {#if isWinner}
              <div class="absolute top-2 right-4 rounded-full bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 text-[10px] font-black tracking-wider text-yellow-500 uppercase">
                Победитель!
              </div>
            {/if}

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl font-black text-xl border {isWinner ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20 shadow-lg shadow-yellow-500/10' : 'bg-muted/40 text-muted-foreground border-border'} shadow-inner">
                  {votingStore.options.findIndex((o) => o.id === stat.id) + 1}
                </span>
                <div>
                  <p class="text-xl font-bold {isWinner ? 'text-yellow-500 font-extrabold' : 'text-foreground'}">
                    {stat.text || `Вариант`}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-black {isWinner ? 'text-yellow-500' : 'text-primary'}">{stat.percentage}%</p>
                <p class="text-xs text-muted-foreground font-semibold">{stat.count} голосов</p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="flex gap-4 mt-8 justify-center">
        <Button
          class="px-10 py-5 text-sm bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
          onclick={() => votingStore.resetVoting()}
        >
          Новое голосование
        </Button>
      </div>
    {/if}

    <!-- Live Recipient / Feed of Recent Votes -->
    {#if votingStore.votingState !== 'idle' && votingStore.votes.size > 0}
      <div class="flex w-full max-w-xl flex-col gap-4 mt-8">
        <h2 class="text-lg font-bold text-center text-muted-foreground tracking-wide uppercase">Последние голоса</h2>
        <div class="flex max-h-[250px] flex-col gap-3 overflow-y-auto rounded-2xl border border-border/50 bg-card/25 backdrop-blur-xs p-6 shadow-sm">
          {#each [...votingStore.votes.values()].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10) as vote (vote.userId)}
            <div class="flex justify-between items-center gap-3 text-sm leading-relaxed border-b border-border/10 pb-2 last:border-0 last:pb-0">
              <div>
                <span class="font-bold text-primary">{vote.username}</span>
                <span class="text-muted-foreground/80"> проголосовал за </span>
                <span class="font-bold text-foreground">Вариант {vote.optionIndex + 1}</span>
              </div>
              <span class="text-xs text-muted-foreground max-w-[200px] truncate font-semibold italic">
                {votingStore.options[vote.optionIndex]?.text || `Вариант ${vote.optionIndex + 1}`}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
