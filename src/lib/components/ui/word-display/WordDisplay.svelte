<script lang="ts">
  type Props = {
    word: string
    revealed?: boolean
  }

  let { word, revealed = false }: Props = $props()
  let revealedIndices = $state<Record<number, boolean>>({})

  $effect(() => {
    if (revealed) {
      word.split('').forEach((_, i) => (revealedIndices[i] = true))
    } else {
      revealedIndices = {}
    }
  })
</script>

<div class="flex flex-wrap gap-2">
  {#each word as char, i (i)}
    <div class="group h-12 w-12 [perspective:1000px]">
      <button
        class="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-400 ease-out
        {revealedIndices[i] ? '[transform:rotateY(180deg)]' : 'cursor-pointer hover:scale-105 active:scale-95'}"
        onclick={() => (revealedIndices[i] = true)}
      >
        <!-- Front -->
        <div
          class="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-white bg-blue-900 shadow-md [backface-visibility:hidden]"
        ></div>
        <!-- Back -->
        <div
          class="absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center rounded-lg border-2 border-white bg-blue-900 text-2xl font-bold text-white uppercase shadow-md [backface-visibility:hidden]"
        >
          {char}
        </div>
      </button>
    </div>
  {/each}
</div>
