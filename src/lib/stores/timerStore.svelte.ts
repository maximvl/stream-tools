import { SvelteDate } from 'svelte/reactivity'

type CountState = 'paused' | 'active' | 'finished'

export class TimerStore {
  state = $state<CountState>('paused')
  tickMs = 1000
  startMs = 0
  startTs = 0

  passedMs = $state(0)
  passedSeconds = $derived(Math.floor(this.passedMs / 1000))
  passedSecondsPart = $derived(this.passedSeconds % 60)

  passedMinutes = $derived(Math.floor(this.passedSeconds / 60))
  passedMinutesPart = $derived(this.passedMinutes % 60)

  passedHours = $derived(Math.floor(this.passedMinutes / 60))
  passedHoursPart = $derived(this.passedHours % 24)

  passedDays = $derived(Math.floor(this.passedHours / 24))
  passedDaysPart = $derived(this.passedDays % 7)

  passedWeeks = $derived(Math.floor(this.passedDays / 7))
  passedWeeksPart = $derived(this.passedWeeks % 7)

  currentMs = $derived(this.startMs + this.passedMs + this.startTs)
  currentDate = $derived(new SvelteDate(this.currentMs))

  limitMs = $state(0)
  remainingMs = $derived(this.limitMs - this.passedMs)
  remainingSeconds = $derived(Math.floor(this.remainingMs / 1000))
  remainingSecondsPart = $derived(this.remainingSeconds % 60)
  
  remainingMinutes = $derived(Math.floor(this.remainingSeconds / 60))
  remainingMinutesPart = $derived(this.remainingMinutes % 60)
  
  remainingHours = $derived(Math.floor(this.remainingMinutes / 60))
  remainingHoursPart = $derived(this.remainingHours % 24)
  
  remainingDays = $derived(Math.floor(this.remainingHours / 24))
  remainingDaysPart = $derived(this.remainingDays % 7)
  
  remainingWeeks = $derived(Math.floor(this.remainingDays / 7))
  remainingWeeksPart = $derived(this.remainingWeeks % 7)

  _interval: ReturnType<typeof setInterval> | undefined = undefined

  tick() {
    if (this.state === 'active') {
      this.passedMs += this.tickMs
    }
  }

  constructor() {
    $effect(() => {
      if (this.passedMs >= this.limitMs && this.state !== 'paused' && this.limitMs > 0) {
        this.state = 'finished'
      }
    })
  }

  start() {
    this.stop()

    this.startMs = 0

    const now = new SvelteDate()
    this.startTs = now.getTime()

    this.state = 'active'

    this._interval = setInterval(() => {
      this.tick()
    }, this.tickMs)
  }

  pause() {
    this.state = 'paused'
  }

  stop() {
    clearInterval(this._interval)
    this.state = 'paused'
    this.passedMs = 0
  }
}
