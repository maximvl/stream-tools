<script lang="ts">
  import { getStore } from '$lib/context'
  import { untrack } from 'svelte'
  import * as Dialog from '../ui/dialog'
  import ConnectionEdit from './ConnectionEdit.svelte'
  import { Button } from '$lib/components/ui/button'
  import { Separator } from '$lib/components/ui/separator'
  import { Plus } from '@lucide/svelte'
  import { ServerIcons } from '$lib/constants'
  import { cn } from '$lib/utils'
  import { connToKey } from '$lib/stores/chatMessagesStore.svelte'

  const store = getStore()

  let open = $state(false)
  let localConnections = $state<typeof store.connections.value>(store.connections.value)

  $effect(() => {
    if (open) {
      localConnections = store.connections.value
    } else {
      untrack(() => {
        const filtered = localConnections.filter((c) => c.channel.trim() !== '')
        store.updateConnections(filtered)
      })
    }
  })

  function addLocalConnection() {
    localConnections.push({
      server: 'twitch',
      channel: ''
    })
  }

  function removeLocalConnection(index: number) {
    localConnections = localConnections.filter((_, i) => i !== index)
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <Button variant="outline" size="sm" class="flex h-auto flex-col px-3 py-1.5">
      <span class="font-medium">Подключение чатов</span>
      <div class="mt-1 flex gap-1.5">
        {#each store.connections.value as conn (connToKey(conn))}
          <img
            src={ServerIcons[conn.server]}
            alt={`${conn.server}/${conn.channel}`}
            class={cn(
              'h-5 w-5 shrink-0',
              !store.connectedConnections.includes(connToKey(conn)) && 'opacity-30 grayscale'
            )}
          />
        {/each}
      </div>
    </Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Подключение чатов</Dialog.Header>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        {#each localConnections as _, i (i)}
          <ConnectionEdit
            bind:connection={localConnections[i]}
            onRemove={() => removeLocalConnection(i)}
          />
        {/each}
      </div>
      <Separator />
      <Button variant="outline" size="sm" onclick={addLocalConnection}>
        <Plus class="mr-2" />
        Добавить
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>

<style>
  /* Optional: prevent icons from being too small on narrow screens */
  img {
    min-width: 0.875rem;
  }
</style>
