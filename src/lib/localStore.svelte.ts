export class LocalStore<T> {
	key: string;
	defaultValue: T | null;
	value = $state<T | null>(null);

	constructor(key: string, defaultValue?: T) {
		this.key = key;
		this.defaultValue = defaultValue || null;

		this.loadValue();
		$effect(() => {
			localStorage.setItem(this.key, JSON.stringify(this.value));
		});
	}

	loadValue() {
		const storedValue = localStorage.getItem(this.key);
		if (storedValue) {
			this.value = JSON.parse(storedValue);
		} else {
			this.value = this.defaultValue;
		}
	}
}
