<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.svg'

  let { children } = $props()

  import { QueryClientProvider } from '@tanstack/svelte-query'
  import { queryClient } from '$lib/context'
  import StoreProvider from './StoreProvider.svelte'
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
  <StoreProvider>
    {@render children()}
  </StoreProvider>
</QueryClientProvider>
