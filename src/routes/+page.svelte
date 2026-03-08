<script lang="ts">
  import ConnectionDialog from '$lib/components/connections/ConnectionDialog.svelte'
  import { WordDisplay } from '$lib/components/ui/word-display'
  import { getStore } from '$lib/context'
  import { Input } from '$lib/components/ui/input'
  import { Button } from '$lib/components/ui/button'

  const store = getStore()
  let word = $state('')
  let isWordSet = $state(false)
  let isRevealed = $state(false)

  function setWord() {
    if (word.trim() !== '') {
      isWordSet = true
      isRevealed = false
    }
  }
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
    {#if !isWordSet}
      <div class="flex w-[400px] flex-col gap-4 text-center">
        <div class="flex gap-2">
          <Input
            type="text"
            placeholder="Слово для угадывания"
            style="-webkit-text-security: disc;"
            bind:value={word}
            onkeydown={(e) => e.key === 'Enter' && setWord()}
          />
          <Button onclick={setWord}>Начать</Button>
        </div>
      </div>
    {:else}
      <div class="flex flex-col items-center gap-4">
        <WordDisplay {word} revealed={isRevealed} />
      </div>
    {/if}

    <div class="flex w-[500px] flex-col gap-4">
      <div
        class="flex max-h-[600px] flex-col gap-3 overflow-y-auto rounded-xl border bg-card p-6 shadow-sm"
      >
        {#if store.newMessages.length === 0}
          <div class="py-12 text-center text-muted-foreground italic">Пока сообщений нет...</div>
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
