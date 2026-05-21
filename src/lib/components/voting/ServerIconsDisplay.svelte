<script lang="ts">
  import { ServerIcons } from '$lib/constants'

  type Props = {
    twitchVotes: number
    vkvideoVotes: number
    kickVotes: number
  }

  let { twitchVotes, vkvideoVotes, kickVotes }: Props = $props()
</script>

<span class="flex items-center gap-2">
  {#if twitchVotes > 0}
    <span class="flex items-center gap-0.5">
      {twitchVotes}
      <img src={ServerIcons['twitch']} alt="Twitch" class="h-4 w-4" />
    </span>
  {/if}
  {#if vkvideoVotes > 0}
    <span class="flex items-center gap-0.5">
      {vkvideoVotes}
      <img src={ServerIcons['vkvideo']} alt="VK Video" class="h-4 w-4" />
    </span>
  {/if}
  {#if kickVotes > 0}
    <span class="flex items-center gap-0.5">
      {kickVotes}
      <img src={ServerIcons['kick']} alt="Kick" class="h-4 w-4" />
    </span>
  {/if}
</span>
