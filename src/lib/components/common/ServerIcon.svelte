<script lang="ts">
  import { ServerIcons } from '$lib/constants'
  import type { ChatServer, ConnectionStatus } from '$lib/types'
  import { cn } from '$lib/utils'
  import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

  type Props = {
    server: ChatServer
    channel?: string
    class?: string
    status: ConnectionStatus
  }

  let { server, channel, class: className = '', status }: Props = $props()
  const inactive = $derived(status === 'disconnected')
  const loading = $derived(status === 'connecting')
</script>

<Tooltip delayDuration={0}>
  <TooltipTrigger>
    <img
      class={cn('h-4 w-4', className, inactive && 'opacity-30 grayscale', loading && 'strong-pulse')}
      src={ServerIcons[server]}
      alt="{server} icon"
    />
  </TooltipTrigger>
  <TooltipContent>
    <p>{server}{channel ? `/${channel}` : ''}</p>
  </TooltipContent>
</Tooltip>


<style>
  @keyframes strong-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.2;
      transform: scale(1.08);
    }
  }
  .strong-pulse {
    animation: strong-pulse 1s ease-in-out infinite;
  }
</style>