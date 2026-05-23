<script lang="ts">
  import { page } from '$app/state'
</script>

<nav class="mb-8 rounded-xl bg-card2 text-xl py-2 px-4">
  <ul class="flex gap-6 font-medium">
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
        class="transition-opacity hover:opacity-100 {page.url.pathname.startsWith('/turnir')
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Турнир
      </a>
    </li>
    <li>
      <a
        href="/loto"
        class="transition-opacity hover:opacity-100 {page.url.pathname.startsWith('/loto')
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Лото
      </a>
    </li>
    <li>
      <a
        href="/word"
        class="transition-opacity hover:opacity-100 {page.url.pathname.startsWith('/word')
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Угадай слово
      </a>
    </li>
    <li>
      <a
        href="/vote"
        class="transition-opacity hover:opacity-100 {page.url.pathname.startsWith('/vote')
          ? 'text-primary'
          : 'opacity-60'}"
      >
        Голосование
      </a>
    </li>
  </ul>
</nav>
