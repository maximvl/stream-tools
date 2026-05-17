<script lang="ts">
  import * as Dialog from '../ui/dialog'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { getLotoConfigStore, resetLotoConfig } from '$lib/stores/lotoStore.svelte'

  const configStore = getLotoConfigStore()
  let open = $state(false)
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <Button variant="outline" size="sm" class="w-full">Настройки</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Настройки лото</Dialog.Header>
    <div class="flex max-h-[70vh] flex-col gap-8 overflow-y-auto pr-2">
      <div class="flex flex-col gap-4">
        <Button variant="destructive" size="sm" class="w-full" onclick={resetLotoConfig}>Сбросить настройки</Button>
        <h3 class="font-semibold text-muted-foreground">Основные настройки</h3>
        <div class="flex flex-col gap-2">
          <Label for="win-matches-amount">Количество совпадений для победы</Label>
          <Input
            id="win-matches-amount"
            type="number"
            bind:value={configStore.value.win_matches_amount}
            min="1"
            max="10"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="ticket-size">Размер билета: {configStore.value.ticket_size}</Label>
          <Input
            id="ticket-size"
            type="range"
            bind:value={configStore.value.ticket_size}
            min="1"
            max="10"
            step="1"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="font-semibold text-muted-foreground">Билеты</h3>
        <div class="flex items-center gap-2">
          <Checkbox id="enable-chat-tickets" bind:checked={configStore.value.enable_chat_tickets} />
          <Label for="enable-chat-tickets" class="cursor-pointer">Билеты из чата</Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="enable-points-tickets"
            bind:checked={configStore.value.enable_points_tickets}
          />
          <Label for="enable-points-tickets" class="cursor-pointer">Билеты за поинты</Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="only-subscribers" bind:checked={configStore.value.only_subscribers} />
          <Label for="only-subscribers" class="cursor-pointer">Только подписчики</Label>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="font-semibold text-muted-foreground">Игра</h3>
        <div class="flex items-center gap-2">
          <Checkbox id="manual-draw-enabled" bind:checked={configStore.value.manual_draw_enabled} />
          <Label for="manual-draw-enabled" class="cursor-pointer">Ручной ввод</Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="allow-mods-to-input-numbers"
            bind:checked={configStore.value.allow_mods_to_input_numbers}
          />
          <Label for="allow-mods-to-input-numbers" class="cursor-pointer">
            Модераторы могут вводить числа
          </Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="allow-tickets-after-start"
            bind:checked={configStore.value.allow_tickets_after_start}
          />
          <Label for="allow-tickets-after-start" class="cursor-pointer">
            Добавлять билеты после старта
          </Label>
        </div>
        <div class="flex flex-col gap-2">
          <Label for="max-number">Максимальное число</Label>
          <Input
            id="max-number"
            type="number"
            bind:value={configStore.value.max_number}
            min="10"
            max="999"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="roll-animation-time">Время анимации (мс)</Label>
          <Input
            id="roll-animation-time"
            type="number"
            bind:value={configStore.value.roll_animation_time}
            min="100"
            max="5000"
            step="100"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="font-semibold text-muted-foreground">Супер игра</h3>
        <div class="flex items-center gap-2">
          <Checkbox
            id="super-game-bonus-guesses-enabled"
            bind:checked={configStore.value.super_game_bonus_guesses_enabled}
          />
          <Label for="super-game-bonus-guesses-enabled" class="cursor-pointer">
            Бонусные попытки за открытия
          </Label>
        </div>
        <div class="flex flex-col gap-2">
          <Label for="super-game-options-amount">Количество ячеек</Label>
          <Input
            id="super-game-options-amount"
            type="number"
            bind:value={configStore.value.super_game_options_amount}
            min="1"
            max="20"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="super-game-guesses-amount">Количество попыток</Label>
          <Input
            id="super-game-guesses-amount"
            type="number"
            bind:value={configStore.value.super_game_guesses_amount}
            min="1"
            max="10"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="super-game-win-score">Количество очков для победы</Label>
          <Input
            id="super-game-win-score"
            type="number"
            bind:value={configStore.value.super_game_win_score}
            min="1"
            max="100"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="super-game-1-pointers">Ячеек за 1 очко</Label>
          <Input
            id="super-game-1-pointers"
            type="number"
            bind:value={configStore.value.super_game_1_pointers}
            min="0"
            max="10"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="super-game-2-pointers">Ячеек за 2 очка</Label>
          <Input
            id="super-game-2-pointers"
            type="number"
            bind:value={configStore.value.super_game_2_pointers}
            min="0"
            max="10"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="super-game-3-pointers">Ячеек за 3 очка</Label>
          <Input
            id="super-game-3-pointers"
            type="number"
            bind:value={configStore.value.super_game_3_pointers}
            min="0"
            max="10"
          />
        </div>
        <div class="mb-10"></div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
