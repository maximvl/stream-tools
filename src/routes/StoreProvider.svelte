<script lang="ts">
  import { Store } from '$lib/store.svelte'
  import { setContext } from 'svelte'

  let { children } = $props()

  // Now this runs safely because it's a child of QueryClientProvider
  const store = new Store()
  setContext('store', store)
</script>

{@render children()}
