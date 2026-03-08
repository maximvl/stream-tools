export class LocalStore<T> {
	key: string;
	defaultValue: T;
	value = $state<T>() as T;

	constructor(key: string, defaultValue: T) {
		this.key = key;
		this.defaultValue = defaultValue;
		this.value = defaultValue;

		this.loadValue();
		$effect(() => {
			localStorage.setItem(this.key, JSON.stringify(this.value));
		});
	}

	loadValue() {
		const storedValue = localStorage.getItem(this.key);
		if (storedValue) {
			try {
				this.value = JSON.parse(storedValue);
			} catch (e) {
				console.error(`Failed to parse stored value for key ${this.key}`, e);
			}
		}
	}
}
