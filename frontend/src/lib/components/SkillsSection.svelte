<script>
  let { data, loading } = $props()
</script>

<div class="card-inner">
  <section class="section">
    <div class="section-header">
      <span class="section-tag">Savoir-faire</span>
      <h2>Compétences <span class="accent">techniques</span></h2>
    </div>

    {#if loading}
      <div class="skeleton-grid">
        {#each Array(4) as _}
          <div class="skeleton-card"></div>
        {/each}
      </div>
    {:else if data}
      <div class="skills-grid">
        {#each data as category}
          <div class="skill-category">
            <h3>
              {#if category.icon}<i class="bx {category.icon}"></i>{/if}
              {category.name}
            </h3>
            <ul class="skill-list">
              {#each category.skills as skill}
                <li class="skill-item" class:framework={skill.type === 'FRAMEWORK'}>
                  {#if skill.type === 'FRAMEWORK'}
                    <span class="framework-parent">{skill.parent} ›</span>
                  {/if}
                  <span class="skill-name">{skill.name}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style lang="scss">
  @use '../../styles/section' as *;

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .skill-category {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.25rem;

    h3 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i { font-size: 1.2rem; }
    }
  }

  .skill-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skill-item {
    font-size: 0.9rem;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.4rem;

    &::before {
      content: '▸';
      color: var(--accent);
      font-size: 0.75rem;
    }

    &.framework {
      margin-left: 1rem;
      color: var(--text-muted);
      font-size: 0.85rem;

      &::before { content: '└'; color: var(--border); }
    }
  }

  .framework-parent {
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.8rem;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .skeleton-card {
    height: 180px;
    background: var(--surface-2);
    border-radius: 0.75rem;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1;   }
  }
</style>
