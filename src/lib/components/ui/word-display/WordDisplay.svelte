<script lang="ts">
  type Props = {
    word: string
  }

  let { word }: Props = $props()
</script>

<div class="flex flex-wrap gap-2">
  {#each word as char, i (i)}
    <div
      class="flex h-12 w-12 items-center justify-center
      rounded-lg border-2 border-white bg-blue-900 text-2xl
      font-bold text-white uppercase shadow-md"
    >
      {char}
    </div>
  {/each}
</div>
