// Basic site interactivity: nav toggle, years, newsletter, comment storage & contact form handling.

(function(){
  // Nav toggle for mobile
  const navToggle = document.querySelectorAll('#navToggle');
  const navs = document.querySelectorAll('#mainNav');

  navToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      navs.forEach(n => n.classList.toggle('open'));
    });
  });

  // Update copyright year in multiple pages
  const yearEls = document.querySelectorAll('[id^="year"]');
  const y = new Date().getFullYear();
  yearEls.forEach(e => e.textContent = y);

  // Newsletter subscribe (localStorage)
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if (!email) return;
      const list = JSON.parse(localStorage.getItem('nm_news') || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem('nm_news', JSON.stringify(list));
      newsletterForm.reset();
      alert('Thanks! You are subscribed.');
    });
  }

  // Comments: simple client-side localStorage per-post
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(form => {
    const postId = form.dataset.post;
    const listEl = form.parentElement.querySelector('.comment-list');
    // load existing
    const saved = JSON.parse(localStorage.getItem('nm_comments_' + postId) || '[]');
    saved.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(c.name)}</strong><div class="muted small">${escapeHtml(c.time)}</div><div>${escapeHtml(c.comment)}</div>`;
      listEl.appendChild(li);
    });

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const comment = form.querySelector('[name="comment"]').value.trim();
      if (!name || !comment) return;
      const obj = {name, comment, time: new Date().toLocaleString()};
      const cur = JSON.parse(localStorage.getItem('nm_comments_' + postId) || '[]');
      cur.unshift(obj);
      localStorage.setItem('nm_comments_' + postId, JSON.stringify(cur));
      // add to UI
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(obj.name)}</strong><div class="muted small">${escapeHtml(obj.time)}</div><div>${escapeHtml(obj.comment)}</div>`;
      listEl.prepend(li);
      form.reset();
    });
  });

  // Contact form (fake send)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();
      const status = document.getElementById('contactStatus');
      if (!name || !email || !msg) {
        status.textContent = 'Please fill all fields.';
        return;
      }
      // Fake send — store to localStorage
      const out = JSON.parse(localStorage.getItem('nm_messages') || '[]');
      out.unshift({name, email, msg, time: new Date().toLocaleString()});
      localStorage.setItem('nm_messages', JSON.stringify(out));
      status.textContent = 'Message sent — we will reply to your email.';
      contactForm.reset();
    });
  }

  // small helper
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];});
  }
})();