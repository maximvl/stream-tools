<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { setContext } from 'svelte';
	import { LocalStore } from '$lib/localStore.svelte';

	const userInput = new LocalStore<string>('userInput', 'initial');
	setContext('userInput', userInput);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
