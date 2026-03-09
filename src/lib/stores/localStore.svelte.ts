class _LocalStore<T> {
  key: string
  value = $state<T>() as T

  constructor(key: string, defaultValue: T | null = null) {
    this.value = this.loadValue(key, defaultValue)
    this.key = key

    $effect(() => {
      localStorage.setItem(this.key, JSON.stringify(this.value))
    })
  }

  loadValue(key: string, defaultValue: T | null): T {
    const storedValue = localStorage.getItem(key)
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue)
      } catch (e) {
        console.error(`Failed to parse stored value for key ${key}`, e)
        return defaultValue as T
      }
    }
    return defaultValue as T
  }
}

export type LocalStore<T> = _LocalStore<T>

export const LocalStore = _LocalStore as unknown as {
  new <T>(key: string, defaultValue: T): LocalStore<T>
  new <T>(key: string): LocalStore<T | null>
}
