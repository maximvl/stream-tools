import { getContext } from 'svelte'
import type { Store } from './store.svelte'
import { QueryClient } from '@tanstack/svelte-query'

export function getStore() {
  return getContext('store') as Store
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1
    }
  }
})
