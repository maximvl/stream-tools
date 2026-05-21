<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import { Button } from '$lib/components/ui/button'

  type Props = {
    index: number
    value: string
    showDelete: boolean
    onDelete: () => void
    onUpdate: (value: string) => void
  }

  let { index, value = $bindable(), showDelete, onDelete, onUpdate }: Props = $props()
</script>

<div class="flex items-center gap-2">
  <span
    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 font-bold"
  >
    {index + 1}
  </span>
  <Input
    type="text"
    placeholder="Текст варианта..."
    {value}
    oninput={(e) => onUpdate(e.currentTarget.value)}
  />
  {#if showDelete}
    <Button
      variant="destructive"
      size="icon"
      onclick={onDelete}
      class="shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
          d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
        /></svg
      >
    </Button>
  {/if}
</div>
