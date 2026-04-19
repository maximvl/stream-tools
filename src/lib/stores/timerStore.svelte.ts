import { SvelteDate } from 'svelte/reactivity'

type CountState = 'paused' | 'active' | 'finished'

export class TimerStore {
  state = $state<CountState>('paused')
  tickMs = 1000
  startMs = 0
  startTs = 0

  passedMs = $state(0)
  passedSeconds = $derived(Math.round(this.passedMs / 1000))
  passedMinutes = $derived(Math.round(this.passedSeconds / 60))
  passedHours = $derived(Math.round(this.passedMinutes / 60))
  passedDays = $derived(Math.round(this.passedHours / 24))
  passedWeeks = $derived(Math.round(Math.round(this.passedDays / 7)))

  currentMs = $derived(this.startMs + this.passedMs + this.startTs)
  currentDate = $derived(new SvelteDate(this.currentMs))

  limitMs = $state(0)
  remainingMs = $derived(this.limitMs - this.passedMs)
  remainingSeconds = $derived(Math.round(this.remainingMs / 1000))
  remainingMinutes = $derived(Math.round(this.remainingSeconds / 60))
  remainingHours = $derived(Math.round(this.remainingMinutes / 60))
  remainingDays = $derived(Math.round(this.remainingHours / 24))
  remainingWeeks = $derived(Math.round(this.remainingDays / 7))

  _interval: ReturnType<typeof setInterval> | undefined = undefined

  tick() {
    if (this.state === 'active') {
      this.passedMs += this.tickMs
    }
  }

  constructor() {
    $effect(() => {
      if (this.passedMs >= this.limitMs && this.state !== 'paused') {
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
