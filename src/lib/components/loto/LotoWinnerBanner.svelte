<script lang="ts">
  import type { LotoTicket } from '$lib/types'

  type Props = {
    ticket: LotoTicket
  }

  let { ticket }: Props = $props()
</script>

<div class="flex flex-col items-center gap-6">
  <div
    class="flex flex-col items-center justify-center rounded-3xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-8 shadow-2xl ring-4 ring-yellow-500/30"
  >
    <div class="mb-4 text-6xl">🎉</div>
    <h1 class="mb-4 text-4xl font-black text-yellow-400">ПОБЕДИТЕЛЬ!</h1>
    <div class="text-2xl font-bold text-white">
      {ticket.owner_name}
    </div>
  </div>
</div>
