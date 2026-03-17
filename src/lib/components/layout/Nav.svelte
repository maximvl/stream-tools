<script lang="ts">
  import { page } from '$app/state'
</script>

<nav class="mb-8">
  <ul class="flex gap-6 text-sm font-medium">
    <li>
      <a
        href="/"
        class="transition-opacity hover:opacity-100 {page.url.pathname === '/'
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Главная
      </a>
    </li>
    <li>
      <a
        href="/turnir"
        class="transition-opacity hover:opacity-100 {page.url.pathname === '/turnir/'
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Турнир
      </a>
    </li>
    <li>
      <a
        href="/loto"
        class="transition-opacity hover:opacity-100 {page.url.pathname === '/loto/'
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Лото
      </a>
    </li>
    <li>
      <a
        href="/word"
        class="transition-opacity hover:opacity-100 {page.url.pathname === '/word'
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Угадай слово
      </a>
    </li>
  </ul>
</nav>
