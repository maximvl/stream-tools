<script lang="ts">
  import type { ChatConnection } from '$lib/types'
  import { getStore } from '$lib/context'
  import { Button } from '$lib/components/ui/button'
  import { Trash2 } from '@lucide/svelte'
  import Input from '../ui/input/input.svelte'
  import * as Select from '../ui/select'

  type Props = {
    connection: ChatConnection
  }

  let { connection = $bindable() }: Props = $props()
  const store = getStore()

  const connections = [
    { value: 'twitch', label: 'twitch.tv' },
    { value: 'kick', label: 'kick.com' },
    { value: 'vkvideo', label: 'vkvideo.ru' }
  ]

  const triggerContent = $derived(
    connections.find((f) => f.value === connection.server)?.label ?? 'Сервер'
  )
</script>

<div class="align-center flex items-center gap-1">
  <Select.Root type="single" bind:value={connection.server}>
    <Select.Trigger>{triggerContent}</Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Item value="twitch">twitch.tv</Select.Item>
        <Select.Item value="kick">kick.com</Select.Item>
        <Select.Item value="vkvideo">vkvideo.ru</Select.Item>
      </Select.Group>
    </Select.Content>
  </Select.Root>
  <div>/</div>
  <Input
    value={connection.channel}
    onchange={(e) => (connection.channel = (e.target as HTMLInputElement).value)}
  />
  <Button
    variant="ghost"
    size="icon"
    class="text-destructive hover:bg-destructive/10 hover:text-destructive"
    onclick={() => store.removeConnection(connection)}
  >
    <Trash2 />
  </Button>
</div>
