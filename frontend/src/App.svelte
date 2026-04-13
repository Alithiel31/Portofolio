<script>
  import { createApiStore } from './lib/stores/api.svelte.js'
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

  const sections = [
    { id: 'hero',       label: 'Profil' },
    { id: 'skills',     label: 'Compétences' },
    { id: 'experience', label: 'Expérience' },
    { id: 'projects',   label: 'Portfolio' },
    { id: 'services',   label: 'Services' },
    { id: 'contact',    label: 'Contact' },
  ]
</script>

<NavDots {sections} />

<main class="scroll-container">
  {#if profile.loading}
    <LoadingSpinner />
  {:else if profile.error}
    <div class="api-error">
      <i class="bx bx-error-circle"></i>
      <p>Impossible de charger le portfolio. Vérifiez la connexion au serveur.</p>
      <button onclick={profile.reload}>Réessayer</button>
    </div>
  {:else}
    <ul class="stacking-cards" style="--card-count: {sections.length}">
      <li class="card" id="hero">
        <HeroSection data={profile.data} />
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
        <ContactSection profile={profile.data} />
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
    outline: none;
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
    // Chaque carte occupe 90vh pour créer l'espace de scroll
    grid-template-rows: repeat(var(--card-count), 90vh);
    padding-bottom: 4rem;
  }

  .card {
    position: sticky;
    top: 1.5rem;
    // Décalage visuel progressif : chaque carte est légèrement plus haute
    padding-top: calc(sibling-index() * 8px);

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;

    // Effet de profondeur au scroll : les cartes du fond rétrécissent
    .card-inner {
      animation: stack-scale linear forwards;
      animation-timeline: view();
      animation-range: 15vh 85vh;
      width: 100%;
      height: 100%;
    }
  }

  @keyframes stack-scale {
    to {
      transform: scale(calc(1 - (sibling-index() * 0.025)));
      filter: brightness(calc(1 - (sibling-index() * 0.04)));
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

      .card-inner {
        animation: none;
      }
    }
  }
</style>
