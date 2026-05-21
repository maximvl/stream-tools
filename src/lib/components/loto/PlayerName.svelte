<script lang="ts">
  import type { ChatUser } from '$lib/types'
  import { VkColorsMap } from '$lib/constants'
  import { cn } from '$lib/utils'

  type Props = {
    user?: ChatUser
    name: string
    class?: string
  }

  let { user, name, class: className }: Props = $props()

  const getUserColor = (): string => {
    if (user?.twitch_fields?.color) {
      return user.twitch_fields.color
    }
    if (user?.vk_fields?.nickColor !== undefined) {
      return VkColorsMap[user.vk_fields.nickColor] || '#D66E34'
    }
    return '#D66E34'
  }

  const userColor = $derived(getUserColor())
</script>

<span class={cn('font-bold bg-black rounded-sm px-1', className)} style="color: {userColor}">
  {name}
</span>
