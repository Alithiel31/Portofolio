<script>
  import { t } from '../i18n/t.svelte.js';
  import { navigate, ROUTES } from '../stores/route.svelte.js';

  let { name = '' } = $props();

  const links = $derived([
    { href: ROUTES.LEGAL, label: t('legal.notice') },
    { href: ROUTES.PRIVACY, label: t('legal.privacy') },
    { href: ROUTES.TERMS, label: t('legal.terms') },
  ]);
</script>

<footer>
  <nav aria-label={t('legal.navLabel')}>
    {#each links as link (link.href)}
      <a href={link.href} onclick={(e) => navigate(e, link.href)}>{link.label}</a>
    {/each}
  </nav>
  <p class="copyright">© {new Date().getFullYear()}{name ? ` ${name}` : ''}</p>
</footer>

<style lang="scss">
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.6rem 1.5rem;
    padding: 1.75rem 1.5rem;
    border-top: 1px solid var(--border);
    font-size: 0.82rem;
    color: var(--text-muted);
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 1.25rem;
  }

  a {
    color: var(--text-muted);
    transition: var(--transition);

    &:hover {
      color: var(--accent);
    }
  }

  .copyright {
    margin: 0;
  }
</style>
