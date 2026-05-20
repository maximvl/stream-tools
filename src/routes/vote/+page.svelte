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
  <title
    >Голосование: {votingStore.votingState === 'voting'
      ? `${votingStore.totalVotes} голосов`
      : 'Настройка'}</title
  >
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
      <div
        class="w-full max-w-xl rounded-3xl border border-primary/20 bg-card p-8 shadow-2xl backdrop-blur-md"
      >
        <h2 class="mb-2 text-2xl font-black text-primary uppercase">Настройка вариантов</h2>
        <p class="mb-6 text-sm text-muted-foreground">
          Укажите варианты ответа. Во время голосования зрители смогут отправлять в чат порядковый
          номер варианта (1, 2, 3...) для участия.
        </p>

        <!-- Voting Duration Configuration -->
        <div class="mb-6 flex flex-col gap-2">
          <label
            class="text-xs font-black tracking-wide text-muted-foreground uppercase"
            for="duration-input"
          >
            Время голосования (сек)
          </label>
          <div class="flex items-center gap-3">
            <Input
              id="duration-input"
              type="number"
              min="0"
              placeholder="0 (без лимита)"
              value={votingStore.durationStore.value}
              oninput={(e) => {
                const val = parseInt(e.currentTarget.value, 10)
                votingStore.durationStore.value = isNaN(val) ? 0 : val
              }}
              class="w-32"
            />
            <span class="text-sm font-semibold text-muted-foreground">сек (0 = без лимита)</span>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          {#each votingStore.options as option, index (option.id)}
            <div class="flex items-center gap-2">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 font-bold"
              >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
                      d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                    /></svg
                  >
                </Button>
              {/if}
            </div>
          {/each}
        </div>

        <Button
          variant="outline"
          class="mt-4 w-full gap-2 rounded-xl border-primary/20 hover:bg-primary/5"
          onclick={() => votingStore.addOption()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg
          >
          Добавить вариант
        </Button>

        <Button
          class="mt-8 w-full rounded-2xl bg-green-600 py-6 text-lg font-black shadow-xl transition-all hover:scale-105 hover:bg-green-500 active:scale-95"
          onclick={() => votingStore.startVoting()}
        >
          Начать голосование
        </Button>
      </div>
    {:else if votingStore.votingState === 'voting'}
      <!-- VOTING IN PROGRESS STATE -->
      <div
        class="mb-8 w-full max-w-xl rounded-2xl border border-primary/20 bg-card/60 px-8 py-6 text-center shadow-lg ring-1 ring-primary/5 backdrop-blur-md"
      >
        <p class="text-xl font-extrabold tracking-wide text-primary uppercase">Идет голосование!</p>
        <p class="mt-2 text-sm text-muted-foreground">
          Напишите в чат цифру <span
            class="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-bold text-primary"
            >1, 2, 3...</span
          > чтобы отдать свой голос
        </p>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-4">
          <div class="flex items-center gap-2">
            <span class="relative flex h-3 w-3">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
              ></span>
              <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
            <span class="text-sm font-bold text-muted-foreground"
              >Всего голосов: {votingStore.totalVotes}</span
            >
          </div>

          {#if votingStore.durationStore.value > 0}
            <div
              class="flex h-9 items-center justify-center rounded-xl border px-3 py-1 shadow-sm ring-1 transition-all {votingStore
                .timer.remainingSeconds <= 10
                ? 'animate-pulse border-red-500/50 bg-red-500/10 text-red-500 ring-red-500/20'
                : 'border-primary/20 bg-card/85 text-primary ring-primary/5'}"
            >
              <span class="mr-1.5 text-[10px] font-black tracking-wider uppercase opacity-80"
                >Времени осталось:</span
              >
              <span class="text-base font-black">
                {Math.max(0, votingStore.timer.remainingSeconds)}
              </span>
              <span class="ml-0.5 text-[10px] opacity-80">сек</span>
            </div>
          {/if}
        </div>
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-4">
        {#each votingStore.optionStats as stat, index (stat.id)}
          <div
            class="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 shadow-sm backdrop-blur-xs transition-all hover:border-primary/30"
          >
            <!-- Animated Progress Bar -->
            <div
              class="absolute inset-y-0 left-0 -z-10 bg-primary/15 transition-all duration-500 ease-out"
              style="width: {stat.percentage}%"
            ></div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span
                  class="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/20 text-xl font-black text-primary shadow-inner"
                >
                  {index + 1}
                </span>
                <div>
                  <p class="text-xl font-bold text-foreground">
                    {stat.text || `Вариант ${index + 1}`}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-black text-primary">{stat.percentage}%</p>
                <p class="text-xs font-semibold text-muted-foreground">{stat.count} голосов</p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-8 flex justify-center gap-4">
        <Button
          variant="outline"
          class="rounded-xl border-destructive/30 px-8 py-5 text-sm font-semibold text-destructive hover:bg-destructive/10"
          onclick={() => votingStore.resetVoting()}
        >
          Сбросить
        </Button>
        <Button
          class="rounded-xl bg-purple-600 px-10 py-5 text-sm font-bold shadow-lg transition-all hover:scale-105 hover:bg-purple-500 active:scale-95"
          onclick={() => votingStore.endVoting()}
        >
          Завершить
        </Button>
      </div>
    {:else if votingStore.votingState === 'ended'}
      <!-- VOTING ENDED / RESULTS STATE -->
      <div
        class="mb-8 flex w-full max-w-xl flex-col items-center rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-8 py-6 text-center shadow-lg backdrop-blur-md"
      >
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
          class="mb-3 animate-bounce text-yellow-500"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 22V18" />
          <path d="M14 22V18" />
          <path d="M18 4H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
          <path d="M12 11V18" />
        </svg>
        <p class="text-xl font-extrabold tracking-wide text-yellow-500 uppercase">
          Результаты голосования
        </p>
        <p class="mt-1 text-sm text-muted-foreground">
          Голосование завершено. Всего собрано голосов: {votingStore.totalVotes}
        </p>
      </div>

      <div class="flex w-full max-w-3xl flex-col gap-4">
        {#each votingStore.optionStats as stat, index (stat.id)}
          {@const isWinner = votingStore.winners.some((w) => w.id === stat.id)}
          <div
            class="relative overflow-hidden rounded-2xl border p-5 transition-all {isWinner
              ? 'border-yellow-500/50 bg-yellow-500/5 shadow-lg ring-1 shadow-yellow-500/5 ring-yellow-500/20'
              : 'border-border/50 bg-card/20'}"
          >
            <!-- Animated Progress Bar -->
            <div
              class="absolute inset-y-0 left-0 -z-10 transition-all duration-500 ease-out {isWinner
                ? 'bg-yellow-500/15'
                : 'bg-primary/15'}"
              style="width: {stat.percentage}%"
            ></div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span
                  class="flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-black {isWinner
                    ? 'border-yellow-500/20 bg-yellow-500/20 text-yellow-500 shadow-lg shadow-yellow-500/10'
                    : 'border-border bg-muted/40 text-muted-foreground'} shadow-inner"
                >
                  {index + 1}
                </span>
                <div>
                  <p
                    class="text-xl font-bold {isWinner
                      ? 'font-extrabold text-yellow-500'
                      : 'text-foreground'}"
                  >
                    {stat.text || `Вариант ${index + 1}`}
                  </p>
                </div>
              </div>
              {#if isWinner}
                <div
                  class="rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-[10px] font-black tracking-wider text-yellow-500 uppercase"
                >
                  Победитель!
                </div>
              {/if}
              <div class="text-right">
                <p class="text-2xl font-black {isWinner ? 'text-yellow-500' : 'text-primary'}">
                  {stat.percentage}%
                </p>
                <p class="text-xs font-semibold text-muted-foreground">{stat.count} голосов</p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-8 flex justify-center gap-4">
        <Button
          class="rounded-xl bg-blue-600 px-10 py-5 text-sm font-bold shadow-lg transition-all hover:scale-105 hover:bg-blue-500 active:scale-95"
          onclick={() => votingStore.resetVoting()}
        >
          Новое голосование
        </Button>
      </div>
    {/if}

    <!-- Live Recipient / Feed of Recent Votes -->
    {#if votingStore.votingState !== 'idle' && votingStore.votes.size > 0}
      <div class="mt-8 flex w-full max-w-xl flex-col gap-4">
        <h2 class="text-center text-lg font-bold tracking-wide text-muted-foreground uppercase">
          Последние голоса
        </h2>
        <div
          class="flex max-h-[250px] flex-col gap-3 overflow-y-auto rounded-2xl border border-border/50 bg-card/25 p-6 shadow-sm backdrop-blur-xs"
        >
          {#each [...votingStore.votes.values()]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10) as vote (vote.userId)}
            <div
              class="flex items-center justify-between gap-3 border-b border-border/10 pb-2 text-sm leading-relaxed last:border-0 last:pb-0"
            >
              <div>
                <span class="font-bold text-primary">{vote.username}</span>
                <span class="text-muted-foreground/80"> проголосовал за </span>
                <span class="font-bold text-foreground">Вариант {vote.optionIndex + 1}</span>
              </div>
              <span
                class="max-w-[200px] truncate text-xs font-semibold text-muted-foreground italic"
              >
                {votingStore.options[vote.optionIndex]?.text || `Вариант ${vote.optionIndex + 1}`}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
