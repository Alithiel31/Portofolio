<script>
  let { message = 'Chargement du portfolio…' } = $props()
</script>

<div class="spinner-wrap" role="status" aria-live="polite" aria-label={message}>
  <div class="spinner" aria-hidden="true">
    <div class="ring"></div>
    <div class="ring ring--delay"></div>
  </div>
  <p>{message}</p>
</div>

<style lang="scss">
  .spinner-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1.5rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .spinner {
    position: relative;
    width: 48px;
    height: 48px;
  }

  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--accent);
    animation: spin 1s linear infinite;

    &--delay {
      inset: 8px;
      border-top-color: rgba(0, 171, 240, 0.4);
      animation-duration: 0.7s;
      animation-direction: reverse;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
