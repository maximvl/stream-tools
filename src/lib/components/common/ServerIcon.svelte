<script lang="ts">
  import { ServerIcons } from '$lib/constants'
  import type { ChatServer } from '$lib/types'
  import { cn } from '$lib/utils'
  import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

  type Props = {
    server: ChatServer
    channel?: string
    class?: string
    inactive?: boolean
  }

  let { server, channel, class: className = '', inactive = false }: Props = $props()
</script>

<Tooltip delayDuration={0}>
  <TooltipTrigger>
    <img
      class={cn('h-4 w-4', className, inactive && 'opacity-30 grayscale')}
      src={ServerIcons[server]}
      alt="{server} icon"
    />
  </TooltipTrigger>
  <TooltipContent>
    <p>{server}{channel ? `/${channel}` : ''}</p>
  </TooltipContent>
</Tooltip>
