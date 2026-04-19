<script>
  let { sections } = $props()

  let activeId = $state(sections[0]?.id ?? '')

  $effect(() => {
    // Pour les cartes sticky, on cherche laquelle est collée en haut du viewport
    // plutôt que d'utiliser IntersectionObserver (qui ne marche pas bien avec sticky)
    function onScroll() {
      const STICKY_TOP = 24 // 1.5rem en px
      let closestId = sections[0]?.id ?? ''
      let closestDist = Infinity

      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const dist = Math.abs(el.getBoundingClientRect().top - STICKY_TOP)
        if (dist < closestDist) {
          closestDist = dist
          closestId = id
        }
      }
      activeId = closestId
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  })

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
</script>

<nav class="nav-dots" aria-label="Navigation sections">
  {#each sections as section}
    <button
      class="dot"
      class:active={activeId === section.id}
      onclick={() => scrollTo(section.id)}
      aria-label={section.label}
      aria-current={activeId === section.id ? 'true' : undefined}
      title={section.label}
    >
      <span class="dot-label">{section.label}</span>
    </button>
  {/each}
</nav>

<style lang="scss">
  .nav-dots {
    position: fixed;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    z-index: 1000;

    @media (max-width: 768px) {
      right: 0.75rem;
    }
  }

  .dot {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--border);
    border: none;
    cursor: pointer;
    transition: var(--transition);
    padding: 0;

    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
    }

    &:hover, &.active {
      background: var(--accent);
      transform: scale(1.3);

      .dot-label {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
      }
    }

    &.active {
      box-shadow: 0 0 0 3px var(--accent-dim);
    }
  }

  .dot-label {
    position: absolute;
    right: calc(100% + 0.6rem);
    top: 50%;
    transform: translateX(6px) translateY(-50%);
    white-space: nowrap;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    border-radius: 0.3rem;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition);
  }
</style>
