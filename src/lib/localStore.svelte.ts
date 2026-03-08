class _LocalStore<T> {
  key: string
  defaultValue: T | null
  value = $state<T>() as T

  constructor(key: string, defaultValue: T | null = null) {
    this.key = key
    this.defaultValue = defaultValue
    this.value = defaultValue as T

    this.loadValue()
    $effect(() => {
      localStorage.setItem(this.key, JSON.stringify(this.value))
    })
  }

  loadValue() {
    const storedValue = localStorage.getItem(this.key)
    if (storedValue !== null) {
      try {
        this.value = JSON.parse(storedValue)
      } catch (e) {
        console.error(`Failed to parse stored value for key ${this.key}`, e)
      }
    }
  }
}

export type LocalStore<T> = _LocalStore<T>

export const LocalStore = _LocalStore as unknown as {
  new <T>(key: string, defaultValue: T): LocalStore<T>
  new <T>(key: string): LocalStore<T | null>
}
