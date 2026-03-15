# Repository Mandates

- **Package Manager:** Always use `pnpm` for all commands (e.g., `pnpm install`, `pnpm run check`). Never use `npm` or `yarn`.
- **Validation:** Always run `pnpm run check` after every code change to ensure type safety.
- **Type Safety:** Avoid using the `any` type as much as possible. Prefer specific types or `unknown` where appropriate to maintain strict type safety.
- **Svelte Practices:** Always use keyed `#each` blocks (e.g., `{#each items as item (item.id)}`) to ensure proper reactivity and performance.
