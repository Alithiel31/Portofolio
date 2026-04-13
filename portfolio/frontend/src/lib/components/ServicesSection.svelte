<script>
  let { data, loading } = $props()
</script>

<div class="card-inner">
  <section class="section">
    <div class="section-header">
      <span class="section-tag">Prestations</span>
      <h2>Ce que je <span class="accent">propose</span></h2>
    </div>

    {#if loading}
      <div class="services-grid">
        {#each Array(4) as _}
          <div class="skeleton-card"></div>
        {/each}
      </div>
    {:else if data}
      <div class="services-grid">
        {#each data as service, i}
          <div class="service-card" style="animation-delay: {i * 0.08}s">
            <div class="service-icon">
              <i class="bx {service.icon}"></i>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style lang="scss">
  @use '/src/styles/section' as *;

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .service-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.5rem 1.25rem;
    text-align: center;
    transition: var(--transition);
    animation: fade-in-up 0.4s ease both;

    &:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: var(--shadow);

      .service-icon {
        background: var(--accent);
        i { color: #fff; }
      }
    }

    h3 {
      font-size: 1rem;
      font-weight: 700;
      margin: 0.75rem 0 0.5rem;
    }

    p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
  }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .service-icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--accent-dim);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    transition: var(--transition);

    i {
      font-size: 1.6rem;
      color: var(--accent);
      transition: var(--transition);
    }
  }

  .skeleton-card {
    height: 180px;
    background: var(--surface-2);
    border-radius: 0.75rem;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }
</style>
