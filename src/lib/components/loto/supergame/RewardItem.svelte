<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip'
  import { POG_IMG } from '$lib/constants'
  import type { VkRole } from '$lib/types'
  import type { SuperGameReward } from '../types'

  type Props = {
    reward: SuperGameReward
    vkRoles: VkRole[]
  }

  const { reward, vkRoles }: Props = $props()

  const vkRole = $derived.by(() => {
    for (const role of vkRoles) {
      if (role.id === reward) {
        return role
      }
    }
    return null
  })
</script>

{#if reward === 'empty'}
  <div></div>
{:else if vkRole}
  <Tooltip>
    <TooltipTrigger>
      <div class="flex items-center justify-center">
        <img src={vkRole.largeUrl} width="30px" height="30px" alt={vkRole.name} />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{vkRole.name}</p>
    </TooltipContent>
  </Tooltip>
{:else if reward === 'x1'}
  <Tooltip>
    <TooltipTrigger>
      <div class="flex items-center justify-center">
        <img
          src="https://images.live.vkvideo.ru/smile/2ec232fd-bb31-4122-b3d1-4c8e7b721561/icon/size/medium"
          width="30px"
          height="30px"
          alt="x1"
        />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>1 очко</p>
    </TooltipContent>
  </Tooltip>
{:else if reward === 'x2'}
  <Tooltip>
    <TooltipTrigger>
      <div class="flex items-center justify-center">
        <img
          src="https://images.live.vkvideo.ru/smile/c78b5408-e42c-4aeb-b6f5-9ca21d73c0f1/icon/size/medium"
          width="30px"
          height="30px"
          alt="x2"
        />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>2 очка</p>
    </TooltipContent>
  </Tooltip>
{:else if reward === 'x3'}
  <Tooltip>
    <TooltipTrigger>
      <div class="flex items-center justify-center">
        <img src={POG_IMG} width="30px" height="30px" alt="x3" />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>3 очка</p>
    </TooltipContent>
  </Tooltip>
{:else}
  <div class="h-16 w-16 bg-green-500">{reward}</div>
{/if}
