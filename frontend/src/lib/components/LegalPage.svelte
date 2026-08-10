<script>
  import { t } from '../i18n/t.svelte.js';
  import { navigate, ROUTES } from '../stores/route.svelte.js';
  import { analytics } from '../stores/analytics.svelte.js';

  let { doc } = $props();
</script>

<article class="legal">
  <a class="back" href={ROUTES.HOME} onclick={(e) => navigate(e, ROUTES.HOME)}>
    <i class="bx bx-arrow-back"></i>
    {t('legal.back')}
  </a>

  <header>
    <h1>{doc.title}</h1>
    <p class="updated">{t('legal.updated')} — {doc.updated}</p>
  </header>

  {#each doc.sections as section (section.h)}
    <section>
      <h2>{section.h}</h2>

      {#each section.p as para, i (i)}
        <p>
          {#if typeof para === 'string'}
            {para}
          {:else}
            {#each para as segment, j (j)}
              {#if typeof segment === 'string'}
                {segment}
              {:else if segment.internal}
                <a href={segment.href} onclick={(e) => navigate(e, segment.href)}>{segment.text}</a>
              {:else}
                <a href={segment.href} target="_blank" rel="noopener noreferrer">{segment.text}</a>
              {/if}
            {/each}
          {/if}
        </p>
      {/each}

      {#if section.table}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                {#each section.table.head as heading (heading)}
                  <th>{heading}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each section.table.rows as row, r (r)}
                <tr>
                  {#each row as cell, c (c)}
                    <td>{cell}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      {#if section.optOut}
        <div class="opt-out" class:off={analytics.optedOut}>
          <p class="opt-out-state">
            <i class="bx {analytics.optedOut ? 'bx-shield-quarter' : 'bx-bar-chart-alt-2'}"></i>
            {analytics.optedOut ? t('legal.optOutOn') : t('legal.optOutOff')}
          </p>
          <button type="button" onclick={() => analytics.toggle()}>
            {analytics.optedOut ? t('legal.optOutDisable') : t('legal.optOutEnable')}
          </button>
        </div>
      {/if}
    </section>
  {/each}
</article>

<style lang="scss">
  .legal {
    max-width: 780px;
    margin: 0 auto;
    padding: 4.5rem 1.5rem 4rem;

    @media (max-width: 768px) {
      padding: 4.5rem 1rem 3rem;
    }
  }

  .back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-muted);
    transition: var(--transition);

    &:hover {
      color: var(--accent);
    }
  }

  header {
    margin: 1.25rem 0 2.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  h1 {
    font-size: clamp(1.7rem, 4vw, 2.4rem);
    font-weight: 800;
    line-height: 1.2;
    color: var(--text);
  }

  .updated {
    margin-top: 0.4rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  section {
    margin-bottom: 2.25rem;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--accent);
    margin-bottom: 0.6rem;
  }

  p {
    font-size: 0.94rem;
    color: var(--text);
    margin-bottom: 0.7rem;
    text-wrap: pretty;
  }

  /* ── Tableau récapitulatif des traitements ──────────────────────────── */
  .table-wrap {
    overflow-x: auto;
    margin: 1rem 0 0.5rem;
    border: 1px solid var(--border);
    border-radius: 0.6rem;
  }

  table {
    width: 100%;
    min-width: 34rem;
    border-collapse: collapse;
    font-size: 0.84rem;
  }

  th,
  td {
    padding: 0.6rem 0.8rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--border);
  }

  th {
    background: var(--surface-2);
    color: var(--text-muted);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  /* ── Bascule d'opposition à la mesure d'audience ────────────────────── */
  .opt-out {
    margin-top: 1rem;
    padding: 1rem 1.1rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 0.6rem;

    &.off {
      border-left-color: #00c864;
    }
  }

  .opt-out-state {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);

    i {
      font-size: 1.1rem;
      color: var(--accent);
    }
  }

  .opt-out.off .opt-out-state i {
    color: #00c864;
  }

  button {
    padding: 0.55rem 1.2rem;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 0.45rem;
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      opacity: 0.85;
    }
  }
</style>
