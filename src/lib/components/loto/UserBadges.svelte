<script lang="ts">
  import type { ChatUser } from '$lib/types'
  import * as Tooltip from '$lib/components/ui/tooltip'

  type Props = {
    user: ChatUser
  }

  let { user }: Props = $props()

  const twitchBadges = $derived(user.twitch_fields?.badges || [])
  const vkRoles = $derived(user.vk_fields?.roles || [])
  const vkBadges = $derived(user.vk_fields?.badges || [])

  const highestPriorityVkRole = $derived.by(() => {
    if (vkRoles.length === 0) return null
    return vkRoles.reduce((highest, current) =>
      current.priority > highest.priority ? current : highest,
    )
  })
</script>

<div class="flex items-center gap-1">
  {#each twitchBadges as badge (badge.id)}
    <Tooltip.Root>
      <Tooltip.Trigger>
        <img
          src={badge.image_url_4x}
          alt={badge.title}
          class="h-4 w-4 shrink-0 transition-transform hover:scale-110"
        />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{badge.title}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/each}

  {#if highestPriorityVkRole}
    <Tooltip.Root>
      <Tooltip.Trigger>
        <img
          src={highestPriorityVkRole.largeUrl}
          alt={highestPriorityVkRole.name}
          class="h-4 w-4 shrink-0 transition-transform hover:scale-110"
        />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{highestPriorityVkRole.name}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}

  {#each vkBadges as badge (badge.id)}
    <Tooltip.Root>
      <Tooltip.Trigger>
        <img
          src={badge.largeUrl}
          alt={badge.name}
          class="h-4 w-4 shrink-0 transition-transform hover:scale-110"
        />
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{badge.name}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/each}
</div>
