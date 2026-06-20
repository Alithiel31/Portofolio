<script>
  import { createApiStore } from './lib/stores/api.svelte.js'
  import { locale } from './lib/stores/locale.svelte.js'
  import { t } from './lib/i18n/t.svelte.js'
  import HeroSection       from './lib/components/HeroSection.svelte'
  import SkillsSection     from './lib/components/SkillsSection.svelte'
  import ExperienceSection from './lib/components/ExperienceSection.svelte'
  import ProjectsSection   from './lib/components/ProjectsSection.svelte'
  import ServicesSection   from './lib/components/ServicesSection.svelte'
  import ContactSection    from './lib/components/ContactSection.svelte'
  import NavDots           from './lib/components/NavDots.svelte'
  import LoadingSpinner    from './lib/components/LoadingSpinner.svelte'

  const profile     = createApiStore('/profile')
  const experiences = createApiStore('/experiences')
  const skills      = createApiStore('/skills')
  const projects    = createApiStore('/projects')
  const services    = createApiStore('/services')

  const API_BASE = import.meta.env.VITE_API_URL ?? ''
  let geoLocation = $state(null)

  $effect(() => {
    fetch(`${API_BASE}/api/location`)
      .then(r => r.json())
      .then(d => { geoLocation = d.location })
      .catch(() => {})

    // Une seule visite loguée par session navigateur
    if (!sessionStorage.getItem('tracked')) {
      sessionStorage.setItem('tracked', '1')
      fetch(`${API_BASE}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page:    '/',
          referer: document.referrer || null,
        }),
      }).catch(() => {})
    }
  })

  const profileData = $derived(
    profile.data ? { ...profile.data, location: geoLocation ?? profile.data.location } : null
  )

  const sections = $derived([
    { id: 'hero',       label: t('nav.about') },
    { id: 'skills',     label: t('nav.expertise') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects',   label: t('nav.works') },
    { id: 'services',   label: t('nav.competencies') },
    { id: 'contact',    label: t('nav.contact') },
  ])
</script>

<div class="lang-switcher">
  <button
    class:active={locale.current === 'fr'}
    onclick={() => locale.set('fr')}
    aria-label="Passer en français"
    aria-pressed={locale.current === 'fr'}
  >FR</button>
  <span aria-hidden="true">|</span>
  <button
    class:active={locale.current === 'en'}
    onclick={() => locale.set('en')}
    aria-label="Switch to English"
    aria-pressed={locale.current === 'en'}
  >EN</button>
</div>

<NavDots {sections} />

<main class="scroll-container">
  {#if profile.loading}
    <LoadingSpinner />
  {:else if profile.error}
    <div class="api-error">
      <i class="bx bx-error-circle"></i>
      <p>{t('error.load')}</p>
      <button onclick={profile.reload}>{t('error.retry')}</button>
    </div>
  {:else}
    <ul class="stacking-cards" style="--card-count: {sections.length}">
      <li class="card" id="hero">
        <HeroSection data={profileData} />
      </li>

      <li class="card" id="skills">
        <SkillsSection data={skills.data} loading={skills.loading} />
      </li>

      <li class="card" id="experience">
        <ExperienceSection data={experiences.data} loading={experiences.loading} />
      </li>

      <li class="card" id="projects">
        <ProjectsSection data={projects.data} loading={projects.loading} />
      </li>

      <li class="card" id="services">
        <ServicesSection data={services.data} loading={services.loading} />
      </li>

      <li class="card" id="contact">
        <ContactSection profile={profileData} />
      </li>
    </ul>
  {/if}
</main>

<style lang="scss">

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    // outline: none removed — :focus-visible in global.scss handles focus indicators
  }

  :global(:root) {
    --bg:         #0f1923;
    --surface:    #1a2635;
    --surface-2:  #213040;
    --accent:     #00abf0;
    --accent-dim: rgba(0, 171, 240, 0.12);
    --text:       #e8edf2;
    --text-muted: #7a9bb5;
    --border:     rgba(0, 171, 240, 0.2);
    --radius:     1rem;
    --shadow:     0 8px 32px rgba(0,0,0,0.4);
    --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(body) {
    background: var(--bg);
    color: var(--text);
    font-family: 'Nunito', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }

  :global(a) { color: var(--accent); }

  .scroll-container {
    min-height: 100vh;
  }

  /* ── Stacking cards mechanism ──────────────────────────────────────── */
  .stacking-cards {
    list-style: none;
    display: grid;
    grid-template-rows: repeat(var(--card-count), 90vh);
    padding-bottom: max(10vh, 4rem);
  }

  .card {
    position: sticky;
    top: 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    // overflow: hidden moved to :global(.card-inner) to avoid breaking sticky positioning

    // Target .card-inner from child components (cross-component selector)
    :global(.card-inner) {
      overflow: hidden;
      border-radius: var(--radius);
      width: 100%;
      height: 100%;

      @supports (animation-timeline: view()) {
        animation: stack-scale linear forwards;
        animation-timeline: view();
        animation-range: 15vh 85vh;
      }
    }
  }

  // Replace unsupported sibling-index() with explicit nth-child + CSS custom property
  @for $i from 1 through 12 {
    .card:nth-child(#{$i}) {
      --si: #{$i};
      padding-top: calc(#{$i} * 8px);
    }
  }

  @keyframes stack-scale {
    to {
      transform: scale(calc(1 - (var(--si, 1) * 0.025)));
      filter: brightness(calc(1 - (var(--si, 1) * 0.04)));
    }
  }

  /* ── Lang switcher ─────────────────────────────────────────────────── */
  .lang-switcher {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2rem;
    padding: 0.3rem 0.75rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-muted);

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0;
      font-family: inherit;
      transition: var(--transition);

      &.active { color: var(--accent); }
      &:hover  { color: var(--text); }
    }
  }

  /* ── Error state ────────────────────────────────────────────────────── */
  .api-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
    color: var(--text-muted);
    text-align: center;
    padding: 2rem;

    i {
      font-size: 3rem;
      color: #e53e3e;
    }

    button {
      margin-top: 0.5rem;
      padding: 0.6rem 1.5rem;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 0.4rem;
      cursor: pointer;
      font-size: 1rem;
      transition: opacity var(--transition);

      &:hover { opacity: 0.85; }
    }
  }

  /* ── Mobile ─────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .stacking-cards {
      grid-template-rows: repeat(var(--card-count), auto);
      gap: 1rem;
      padding: 1rem;
    }

    .card {
      position: relative;
      top: auto;
      padding-top: 0;

      :global(.card-inner) {
        animation: none;
      }
    }
  }
</style>
