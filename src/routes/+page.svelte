<script lang="ts">
  import type { LocalStore } from '$lib/localStore.svelte'
  import { getContext } from 'svelte'

  const inputStore = getContext('userInput') as LocalStore<string>
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<input
  type="text"
  placeholder="Type something..."
  value={inputStore.value}
  onchange={(e) => (inputStore.value = (e.target as HTMLInputElement).value)}
/>
