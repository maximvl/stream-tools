<script lang="ts">
  import { getStore } from '$lib/context'
  import * as Dialog from '../ui/dialog'
  import ConnectionButton from './ConnectionButton.svelte'
  import ConnectionEdit from './ConnectionEdit.svelte'

  const store = getStore()
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <ConnectionButton />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Подключение чатов</Dialog.Header>
    <div>
      {#each store.connections.value as connection (connection.server + connection.channel)}
        <ConnectionEdit {connection} />
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>
