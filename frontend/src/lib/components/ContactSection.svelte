<script>
  let { profile } = $props()

  let name    = $state('')
  let email   = $state('')
  let message = $state('')
  let status  = $state(null) // 'sending' | 'success' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    status = 'sending'
    // Ici vous pouvez brancher un service mail (Resend, SendGrid, etc.)
    // Pour l'instant, simuler un délai
    await new Promise(r => setTimeout(r, 1200))
    status = 'success'
    name = email = message = ''
  }
</script>

<div class="card-inner">
  <section class="section">
    <div class="section-header">
      <span class="section-tag">Contact</span>
      <h2>Travaillons <span class="accent">ensemble</span></h2>
    </div>

    <div class="contact-layout">
      <div class="contact-info">
        {#if profile?.email}
          <a href="mailto:{profile.email}" class="contact-item">
            <div class="contact-icon"><i class="bx bx-envelope"></i></div>
            <div>
              <span class="contact-label">Email</span>
              <span class="contact-value">{profile.email}</span>
            </div>
          </a>
        {/if}

        {#if profile?.location}
          <div class="contact-item">
            <div class="contact-icon"><i class="bx bx-map-pin"></i></div>
            <div>
              <span class="contact-label">Localisation</span>
              <span class="contact-value">{profile.location}</span>
            </div>
          </div>
        {/if}

        {#if profile?.socialLinks?.length}
          <div class="social-row">
            {#each profile.socialLinks as link}
              <a href={link.url} target="_blank" rel="noopener" class="social-btn" aria-label={link.platform}>
                <i class="bx {link.icon}"></i>
              </a>
            {/each}
          </div>
        {/if}
      </div>

      <form class="contact-form" onsubmit={handleSubmit}>
        <div class="form-row">
          <div class="field">
            <label for="name">Nom</label>
            <input
              id="name" type="text" bind:value={name}
              placeholder="Votre nom" required
            />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input
              id="email" type="email" bind:value={email}
              placeholder="votre@email.com" required
            />
          </div>
        </div>

        <div class="field">
          <label for="message">Message</label>
          <textarea
            id="message" bind:value={message}
            placeholder="Votre message..." rows="5" required
          ></textarea>
        </div>

        {#if status === 'success'}
          <div class="form-feedback success">
            <i class="bx bx-check-circle"></i>
            Message envoyé ! Je vous répondrai rapidement.
          </div>
        {:else if status === 'error'}
          <div class="form-feedback error">
            <i class="bx bx-error-circle"></i>
            Une erreur est survenue. Réessayez ou contactez-moi par email.
          </div>
        {/if}

        <button type="submit" class="submit-btn" disabled={status === 'sending'}>
          {#if status === 'sending'}
            <i class="bx bx-loader-alt bx-spin"></i> Envoi en cours…
          {:else}
            <i class="bx bx-send"></i> Envoyer le message
          {/if}
        </button>
      </form>
    </div>
  </section>
</div>

<style lang="scss">
  @use '../../styles/section' as *;

  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-top: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    text-decoration: none;
    transition: var(--transition);

    &:hover {
      border-color: var(--accent);
    }
  }

  .contact-icon {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: var(--accent-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
      font-size: 1.1rem;
      color: var(--accent);
    }
  }

  .contact-label {
    display: block;
    font-size: 0.72rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .contact-value {
    display: block;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text);
    margin-top: 0.1rem;
  }

  .social-row {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.25rem;
  }

  .social-btn {
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
    }
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.9rem;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
    }
  }

  input, textarea {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.65rem 0.9rem;
    font-size: 0.9rem;
    color: var(--text);
    font-family: inherit;
    transition: var(--transition);
    resize: none;

    &::placeholder { color: var(--text-muted); }

    &:focus {
      outline: none;
      border-color: var(--accent);
      background: var(--surface);
    }
  }

  .form-feedback {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.88rem;
    font-weight: 600;

    i { font-size: 1.1rem; }

    &.success {
      background: rgba(0, 200, 100, 0.1);
      border: 1px solid rgba(0, 200, 100, 0.3);
      color: #00c864;
    }

    &.error {
      background: rgba(229, 62, 62, 0.1);
      border: 1px solid rgba(229, 62, 62, 0.3);
      color: #e53e3e;
    }
  }

  .submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    align-self: flex-start;

    i { font-size: 1rem; }

    &:hover:not(:disabled) {
      opacity: 0.85;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
</style>
