<script lang="ts">
  import { getStore } from '$lib/context'
  import { untrack } from 'svelte'
  import * as Dialog from '../ui/dialog'
  import ConnectionButton from './ConnectionButton.svelte'
  import ConnectionEdit from './ConnectionEdit.svelte'
  import { Button } from '$lib/components/ui/button'
  import { Separator } from '$lib/components/ui/separator'
  import { Plus } from '@lucide/svelte'

  const store = getStore()

  let open = $state(false)

  $effect(() => {
    if (!open) {
      untrack(() => {
        store.cleanupEmptyConnections()
      })
    }
  })
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <ConnectionButton />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Подключение чатов</Dialog.Header>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        {#each store.connections.value as _, i (store.connections.value[i])}
          <ConnectionEdit bind:connection={store.connections.value[i]} />
        {/each}
      </div>
      <Separator />
      <Button variant="outline" size="sm" onclick={() => store.addConnection()}>
        <Plus class="mr-2" />
        Добавить
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
