<script lang="ts">
  import { cn } from '$lib/utils'

  type Props = {
    class?: string
  }

  let { class: className }: Props = $props()
</script>

<div class={cn('relative flex items-center justify-center gap-4', className)}>
  <div class="relative">
    <div
      class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-50 blur-xl"
    ></div>
    <div
      class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-4xl font-black text-white shadow-lg"
    >
      🎱
    </div>
  </div>
  <div class="flex flex-col">
    <h1
      class="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-6xl font-black tracking-tighter text-transparent uppercase italic"
    >
      Лото&nbsp;
    </h1>
    <div class="flex gap-2">
      <div class="h-2 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div class="h-2 w-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-500"></div>
      <div class="h-2 w-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"></div>
    </div>
  </div>
</div>
