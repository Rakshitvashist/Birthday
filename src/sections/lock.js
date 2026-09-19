// Lock screen. Resolves once she types an accepted answer.
export function mountLock(host, content) {
  const c = content.lock;
  const el = document.createElement('div');
  el.className = 'lock';
  el.innerHTML = `
    <div class="lock-card">
      <span class="lock-icon">🔐</span>
      <h1>${c.question}</h1>
      <p class="hint">${c.hint}</p>
      <form autocomplete="off">
        <input type="text" name="answer" inputmode="text" placeholder="Type it here" aria-label="Answer" />
        <button class="btn" type="submit">Unlock</button>
        <div class="error" aria-live="polite"></div>
      </form>
    </div>`;
  host.appendChild(el);

  const input = el.querySelector('input');
  const error = el.querySelector('.error');
  const form = el.querySelector('form');
  const normalise = (s) => s.trim().toLowerCase().replace(/\s+/g, '');
  const accepted = c.answers.map(normalise);
  let tries = 0;

  return new Promise((resolve) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (accepted.includes(normalise(input.value))) {
        error.textContent = '';
        input.blur();
        el.classList.add('open');
        setTimeout(() => el.remove(), 1000);
        resolve();
        return;
      }
      error.textContent = c.wrongMessages[Math.min(tries, c.wrongMessages.length - 1)];
      tries += 1;
      input.classList.remove('shake');
      void input.offsetWidth; // restart the animation
      input.classList.add('shake');
      input.value = "";
      input.focus({ preventScroll: true });
    });
    setTimeout(() => input.focus({ preventScroll: true }), 1600);
  });
}
