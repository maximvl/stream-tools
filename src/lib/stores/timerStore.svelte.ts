import { SvelteDate } from 'svelte/reactivity'

type CountState = 'paused' | 'active'

export class TimerStore {
  state = $state<CountState>('paused')
  tickMs = 1000
  startMs = 0

  passedMs = $state(0)
  passedSeconds = $derived(Math.round(this.passedMs / 1000))
  passedMinutes = $derived(Math.round(this.passedSeconds / 60))
  passedHours = $derived(Math.round(this.passedMinutes / 60))
  passedDays = $derived(Math.round(this.passedHours / 24))
  passedWeeks = $derived(Math.round(Math.round(this.passedDays / 7)))

  currentMs = $derived(this.startMs + this.passedMs)
  currentDate = $derived(new SvelteDate(this.currentMs))

  limitMs = 0
  remainingMs = $derived(this.limitMs - this.passedMs)
  remainingSeconds = $derived(Math.round(this.limitMs / 1000))
  remainingMinutes = $derived(Math.round(this.remainingSeconds / 60))
  remainingHours = $derived(Math.round(this.remainingMinutes / 60))
  remainingDays = $derived(Math.round(this.remainingHours / 24))
  remainingWeeks = $derived(Math.round(this.remainingDays / 7))

  _interval: number | undefined = undefined

  constructor() {
    $effect(() => {
      if (this.currentMs >= this.limitMs) {
        this.pause()
      }
    })
  }

  start() {
    this.stop()

    const now = new SvelteDate()
    this.startMs = now.getTime()
    this.state = 'active'

    this._interval = setInterval(() => {
      switch (this.state) {
        case 'paused':
          return
        case 'active': {
          this.passedMs += this.tickMs
          return
        }
      }
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
