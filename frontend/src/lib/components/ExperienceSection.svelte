<script>
  let { data, loading } = $props()

  let activeTab = $state('WORK')

  const filtered = $derived(
    data ? data.filter(e => e.type === activeTab) : []
  )
</script>

<div class="card-inner">
  <section class="section">
    <div class="section-header">
      <span class="section-tag">Parcours</span>
      <h2>Expériences & <span class="accent">formations</span></h2>
    </div>

    <div class="tabs">
      <button
        class="tab" class:active={activeTab === 'WORK'}
        onclick={() => activeTab = 'WORK'}
      >
        <i class="bx bx-briefcase"></i> Professionnel
      </button>
      <button
        class="tab" class:active={activeTab === 'EDUCATION'}
        onclick={() => activeTab = 'EDUCATION'}
      >
        <i class="bx bx-book-open"></i> Formation
      </button>
    </div>

    {#if loading}
      <div class="timeline-skeleton">
        {#each Array(3) as _}
          <div class="skeleton-item"></div>
        {/each}
      </div>
    {:else}
      <div class="timeline">
        {#each filtered as exp, i}
          <div class="timeline-item" style="animation-delay: {i * 0.1}s">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-year">
                <i class="bx bxs-calendar"></i> {exp.year}
              </span>
              <h3>{exp.title}</h3>
              <p class="timeline-company">{exp.company}</p>
              <p class="timeline-desc">{exp.description}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style lang="scss">
  @use '../../styles/section' as *;

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin: 1.25rem 0;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1.1rem;
    border: 1px solid var(--border);
    border-radius: 2rem;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition);

    i { font-size: 1rem; }

    &.active, &:hover {
      background: var(--accent-dim);
      color: var(--accent);
      border-color: var(--accent);
    }
  }

  .timeline {
    position: relative;
    padding-left: 1.5rem;
    border-left: 2px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 0.5rem;
    max-height: 420px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .timeline-item {
    position: relative;
    animation: fade-in-left 0.4s ease both;
  }

  @keyframes fade-in-left {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .timeline-dot {
    position: absolute;
    left: -1.83rem;
    top: 0.35rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--accent);
    border: 2px solid var(--surface);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }

  .timeline-content {
    padding: 1rem 1.25rem;
    background: var(--surface-2);
    border-radius: 0.75rem;
    border: 1px solid var(--border);
  }

  .timeline-year {
    font-size: 0.85rem;
    color: var(--accent);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 0.35rem;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.2rem;
  }

  .timeline-company {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.4rem;
  }

  .timeline-desc {
    font-size: 0.88rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .timeline-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    padding-left: 1.5rem;
    border-left: 2px solid var(--border);
  }

  .skeleton-item {
    height: 100px;
    background: var(--surface-2);
    border-radius: 0.75rem;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1;   }
  }
</style>
