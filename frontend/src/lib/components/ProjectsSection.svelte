<script>
  let { data, loading } = $props()
</script>

<div class="card-inner">
  <section class="section">
    <div class="section-header">
      <span class="section-tag">Réalisations</span>
      <h2>Mes <span class="accent">projets</span></h2>
    </div>

    {#if loading}
      <div class="projects-grid">
        {#each Array(3) as _}
          <div class="skeleton-card"></div>
        {/each}
      </div>
    {:else if data}
      <div class="projects-grid">
        {#each data as project}
          <article class="project-card" class:featured={project.featured}>
            {#if project.featured}
              <span class="featured-badge">
                <i class="bx bx-star"></i> Featured
              </span>
            {/if}

            <div class="project-img">
              {#if project.imageUrl}
                <img src={project.imageUrl} alt={project.title} loading="lazy" />
              {:else}
                <div class="img-placeholder">
                  <i class="bx bx-code-block"></i>
                </div>
              {/if}
            </div>

            <div class="project-body">
              <h3>{project.title}</h3>
              <p class="project-desc">{project.description}</p>
              <div class="tech-tags">
                {#each project.techStack.split(',') as tech}
                  <span class="tag">{tech.trim()}</span>
                {/each}
              </div>
            </div>

            <div class="project-links">
              {#if project.githubUrl}
                <a href={project.githubUrl} target="_blank" rel="noopener" class="link-btn">
                  <i class="bx bxl-github"></i> Code
                </a>
              {/if}
              {#if project.demoUrl}
                <a href={project.demoUrl} target="_blank" rel="noopener" class="link-btn primary">
                  <i class="bx bx-link-external"></i> Demo
                </a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style lang="scss">
  @use '../../styles/section' as *;

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
    max-height: 420px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .project-card {
    position: relative;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: var(--transition);

    &:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: var(--shadow);
    }

    &.featured {
      border-color: rgba(0, 171, 240, 0.4);
    }
  }

  .featured-badge {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    background: var(--accent);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    z-index: 1;

    i { font-size: 0.8rem; }
  }

  .project-img {
    width: 100%;
    height: 150px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    &:hover img { transform: scale(1.05); }
  }

  .img-placeholder {
    width: 100%;
    height: 100%;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: var(--border);
  }

  .project-body {
    padding: 1rem;
    flex: 1;

    h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
    }
  }

  .project-desc {
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tag {
    font-size: 0.72rem;
    padding: 0.2rem 0.55rem;
    background: var(--accent-dim);
    color: var(--accent);
    border-radius: 2rem;
    font-weight: 600;
  }

  .project-links {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 0.6rem;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.9rem;
    border-radius: 0.4rem;
    font-size: 0.82rem;
    font-weight: 600;
    border: 1px solid var(--border);
    color: var(--text-muted);
    transition: var(--transition);

    i { font-size: 0.95rem; }

    &:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    &.primary {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);

      &:hover { opacity: 0.85; }
    }
  }

  .skeleton-card {
    height: 320px;
    background: var(--surface-2);
    border-radius: 0.75rem;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
      max-height: none;
      overflow-y: visible;
    }
  }
</style>
