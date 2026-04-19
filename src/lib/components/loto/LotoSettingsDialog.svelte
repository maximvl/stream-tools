<script lang="ts">
  import * as Dialog from '../ui/dialog'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import type { LotoConfig } from '$lib/stores/lotoStore.svelte'

  let { config, onSave }: { config: LotoConfig; onSave: (config: LotoConfig) => void } = $props()

  let open = $state(false)
  let localConfig = $state<LotoConfig>({
    ticket_size: 8,
    max_number: 99,
    roll_animation_time: 1500,
  })

  $effect(() => {
    if (open) {
      localConfig = { ...config }
    }
  })

  function handleSave() {
    onSave(localConfig)
    open = false
  }

  function handleCancel() {
    localConfig = { ...config }
    open = false
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <Button variant="outline" size="sm">Настройки</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Настройки лото</Dialog.Header>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <Label for="ticket-size">Размер билета</Label>
        <Input
          id="ticket-size"
          type="number"
          bind:value={localConfig.ticket_size}
          min="1"
          max="20"
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="max-number">Максимальное число</Label>
        <Input
          id="max-number"
          type="number"
          bind:value={localConfig.max_number}
          min="10"
          max="999"
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label for="roll-animation-time">Время анимации (мс)</Label>
        <Input
          id="roll-animation-time"
          type="number"
          bind:value={localConfig.roll_animation_time}
          min="100"
          max="5000"
          step="100"
        />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={handleCancel}>Отмена</Button>
      <Button onclick={handleSave}>Сохранить</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
