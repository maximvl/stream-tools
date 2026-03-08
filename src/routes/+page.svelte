<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { WordDisplay } from '$lib/components/ui/word-display'
  import { getStore } from '$lib/context'

  const store = getStore()
</script>

<div class="dark flex min-h-screen flex-col items-center p-8">
  <nav class="mb-8">
    <ul class="flex gap-6 text-sm font-medium opacity-60">
      <li><a href="/" class="hover:opacity-100">Турнир</a></li>
      <li><a href="/loto" class="hover:opacity-100">Лото</a></li>
      <li><a href="/word" class="hover:opacity-100">Угадай слово</a></li>
    </ul>
  </nav>

  <div class="mb-12 flex w-full max-w-6xl items-center">
    <div class="w-[250px]">
      <ConnectionDialog />
    </div>
    <div class="flex-1 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight">Угадай слово</h1>
    </div>
    <div class="w-[250px]"></div>
  </div>

  <div class="flex w-full flex-col items-center gap-12">
    <WordDisplay word="GEMINI" />

    <div class="flex w-[500px] flex-col gap-4">
      <h2 class="text-lg font-semibold">Догадки</h2>
      <div
        class="flex max-h-[600px] flex-col gap-3 overflow-y-auto rounded-xl border bg-card p-6 shadow-sm"
      >
        {#if store.newMessages.length === 0}
          <div class="py-12 text-center text-muted-foreground italic">No new messages yet...</div>
        {:else}
          {#each store.newMessages as message (message.id)}
            <div class="flex gap-3 text-sm leading-relaxed">
              <span class="font-bold text-primary">{message.user.username}:</span>
              <span class="text-card-foreground/90">{message.message}</span>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
