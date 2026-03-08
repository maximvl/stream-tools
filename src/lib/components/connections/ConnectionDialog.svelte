<script lang="ts">
  import * as Dialog from '../ui/dialog'
  import ConnectionButton from './ConnectionButton.svelte'
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <ConnectionButton />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Подключение чатов</Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
