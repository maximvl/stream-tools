<script lang="ts">
  import { getChatStore } from '$lib/context'
  import { getVotingStore } from '$lib/stores/votingStore.svelte'
  import UserBadges from '$lib/components/loto/UserBadges.svelte'
  import PlayerName from '$lib/components/loto/PlayerName.svelte'
  import { ServerIcons } from '$lib/constants'

  const chatStore = getChatStore()
  const votingStore = getVotingStore()
</script>

<div
  class="flex h-full flex-col gap-3 rounded-2xl border border-border/50 bg-card/25 p-6 shadow-sm backdrop-blur-xs"
>
  {#each [...votingStore.votes.values()].sort((a, b) => b.timestamp - a.timestamp) as vote (vote.userId)}
    {@const user = chatStore.usersById.get(vote.userId)!}
    {@const voteChange =
      vote.previousOptionIndex !== undefined && vote.previousOptionIndex !== vote.optionIndex}
    {@const previousOptionText =
      vote.previousOptionIndex !== undefined
        ? votingStore.options[vote.previousOptionIndex]?.text
        : null}
    {@const voteText =
      votingStore.options[vote.optionIndex]?.text || `Вариант ${vote.optionIndex + 1}`}
    <div
      class="flex items-center justify-between gap-3 border-b border-border/10 pb-2 text-sm leading-relaxed last:border-0 last:pb-0"
    >
      <div class="flex items-center gap-2">
        <span
          >{new Date(vote.timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}</span
        >
        <img src={ServerIcons[user.source.server]} alt="Server" class="h-4 w-4" />
        <UserBadges {user} />
        <PlayerName {user} name={user.username} class="truncate" />
        {#if voteChange}
          <span class="text-muted-foreground/80">
            переобувается с <span class="font-bold text-foreground">{previousOptionText}</span> на
          </span>
        {:else}
          <span class="text-muted-foreground/80"> голосует за </span>
        {/if}
        <span class="font-bold text-foreground">
          {voteText}
        </span>
      </div>
    </div>
  {/each}
</div>
