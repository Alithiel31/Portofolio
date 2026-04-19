<script>
  let { data } = $props()
</script>

<div class="card-inner">
  <section class="hero">
    <div class="hero-content">
      <div class="avatar-wrap">
        {#if data?.photoUrl}
          <img src={data.photoUrl} alt={data.name} class="avatar" />
        {:else}
          <div class="avatar-placeholder">
            <i class="bx bx-user"></i>
          </div>
        {/if}
        <div class="avatar-ring"></div>
      </div>

      <div class="hero-text">
        <p class="hero-greeting">Hello ! I'm</p>
        <h1>{data?.name ?? '...'}</h1>
        <h2>{data?.title ?? ''}</h2>
        <p class="hero-bio">{data?.bio ?? ''}</p>

        {#if data?.socialLinks?.length}
          <div class="social-links">
            {#each data.socialLinks as link}
              <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                <i class="bx {link.icon}"></i>
              </a>
            {/each}
          </div>
        {/if}

        <div class="hero-cta">
          {#if data?.cvUrl}
            <a href={data.cvUrl} class="btn btn-primary" download>
              <i class="bx bx-download"></i> Download CV
            </a>
          {/if}
          <a href="#contact" class="btn btn-outline">
            <i class="bx bx-envelope"></i> Contact Me
          </a>
        </div>
      </div>
    </div>

    {#if data?.location || data?.email}
      <div class="hero-meta">
        {#if data.location}
          <span><i class="bx bx-map-pin"></i> {data.location}</span>
        {/if}
        {#if data.email}
          <span><i class="bx bx-envelope"></i> {data.email}</span>
        {/if}
      </div>
    {/if}
  </section>
</div>

<style lang="scss">
  .card-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    max-width: 700px;
    width: 100%;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .avatar-wrap {
    position: relative;
    width: 140px;
    height: 140px;
    flex-shrink: 0;
  }

  .avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent);
    position: relative;
    z-index: 1;
  }

  .avatar-placeholder {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: var(--surface-2);
    border: 3px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    color: var(--accent);
  }

  .avatar-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid var(--border);
    animation: ring-pulse 3s ease-in-out infinite;
  }

  @keyframes ring-pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.04); }
  }

  .hero-greeting {
    font-size: 1rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    color: var(--text);
  }

  h2 {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 600;
    color: var(--accent);
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .hero-bio {
    font-size: 1rem;
    color: var(--text-muted);
    max-width: 540px;
    line-height: 1.7;
  }

  .social-links {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 0.5rem;

    a {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--accent);
      transition: var(--transition);

      &:hover {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
        transform: translateY(-2px);
      }
    }
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.5rem;
    border-radius: 0.4rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);

    i { font-size: 1.1rem; }

    &.btn-primary {
      background: var(--accent);
      color: #fff;
      border: none;

      &:hover { opacity: 0.85; transform: translateY(-1px); }
    }

    &.btn-outline {
      background: transparent;
      color: var(--accent);
      border: 1px solid var(--accent);

      &:hover {
        background: var(--accent-dim);
        transform: translateY(-1px);
      }
    }
  }

  .hero-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 0.85rem;
    color: var(--text-muted);

    span {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      i { color: var(--accent); }
    }
  }

  @media (max-width: 768px) {
    .card-inner { padding: 1.5rem 1rem; }

    h1 { font-size: 2rem; }
  }
</style>
