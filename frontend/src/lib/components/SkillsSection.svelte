<script>
  import { t } from '../i18n/t.svelte.js';
  let { data, loading } = $props();

  function needsInvert(iconUrl) {
    return (
      iconUrl &&
      (iconUrl.includes('express') ||
        iconUrl.includes('nextjs') ||
        iconUrl.includes('fastify') ||
        iconUrl.includes('prisma'))
    );
  }
</script>

<div class="card-inner">
  <section class="section">
    <div class="section-header">
      <span class="section-tag">{t('skills.tag')}</span>
      <h2>{t('skills.title')} <span class="accent">{t('skills.titleAccent')}</span></h2>
    </div>

    {#if loading}
      <div class="skeleton-grid">
        {#each Array(4) as _, i (i)}
          <div class="skeleton-card"></div>
        {/each}
      </div>
    {:else if data}
      <div class="skills-grid">
        {#each data as category (category.id)}
          <div class="skill-category">
            <h3>
              {#if category.icon}<i class="bx {category.icon}"></i>{/if}
              {category.name}
            </h3>
            <ul class="skill-list">
              {#each category.skills as skill (skill.id)}
                <li
                  class="skill-item"
                  class:framework={skill.type === 'FRAMEWORK'}
                  class:learning={skill.type === 'LEARNING'}
                >
                  {#if skill.iconUrl}
                    <img
                      src={skill.iconUrl}
                      alt={skill.name}
                      class="skill-icon"
                      class:invert={needsInvert(skill.iconUrl)}
                      loading="lazy"
                    />
                  {:else}
                    <span class="skill-icon-placeholder"></span>
                  {/if}
                  <span class="skill-name">{skill.name}</span>
                  {#if skill.type === 'LEARNING'}
                    <span class="learning-badge">{t('skills.learning')}</span>
                  {/if}
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

      i {
        font-size: 1.2rem;
      }
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
    gap: 0.6rem;

    &.framework {
      margin-left: 1.2rem;
      color: var(--text-muted);
      font-size: 0.85rem;

      .skill-icon {
        width: 16px;
        height: 16px;
        opacity: 0.75;
      }
    }

    &.learning {
      font-style: italic;
      color: var(--text-muted);
    }
  }

  .learning-badge {
    font-size: 0.7rem;
    font-style: normal;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 999px;
    padding: 0.05rem 0.4rem;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0.8;
  }

  .skill-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    flex-shrink: 0;

    &.invert {
      filter: invert(1) brightness(2);
    }
  }

  .skill-icon-placeholder {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 3px;
    background: var(--accent-dim);
  }

  .skill-name {
    line-height: 1.2;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .skeleton-card {
    height: 180px;
    @extend %skeleton-shimmer;
  }
</style>
