/* =========================================
   CLOUDSUFI SRE — script.js (enhanced)
   ========================================= */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== MOBILE NAV — working panel with overlay =====
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMobileMenu() {
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

// Close when overlay is clicked
mobileOverlay?.addEventListener('click', closeMobileMenu);

// Close when a mobile nav link is clicked
document.querySelectorAll('.mobile-nav-links a, .mobile-nav-ctas a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    closeMobileMenu();
    navToggle?.focus();
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = a.getAttribute('href');
    if (target === '#') return;
    const el = document.querySelector(target);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger siblings
document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 80}ms`;
  revealObs.observe(el);
});

// ===== TYPEWRITER — terminal lines =====
function animateTerminal(container) {
  const lines = container.querySelectorAll('.ivc-row, .tline');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      line.style.opacity = line.classList.contains('dim') ? '0.4' : '1';
      line.style.transform = 'translateX(0)';
    }, i * 600 + 400);
  });
}

const termObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateTerminal(entry.target);
      termObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.intro-visual-card, .terminal-card').forEach(el => termObs.observe(el));

// ===== STAT COUNTER ANIMATION (FIXED) =====
// Handles: "99.99%", "3×", "8 min", "$2.4M", "99%↓", "70%"
// Uses data-target, data-suffix, data-prefix, data-decimals attributes.
// Falls back to parsing textContent if data-target is absent.

function animateCounter(el, duration) {
  // Prefer explicit data attributes
  let target   = parseFloat(el.dataset.target);
  let suffix   = el.dataset.suffix   !== undefined ? el.dataset.suffix   : '';
  let prefix   = el.dataset.prefix   !== undefined ? el.dataset.prefix   : '';
  let decimals = el.dataset.decimals !== undefined ? parseInt(el.dataset.decimals, 10) : 0;

  // If no data-target, parse from textContent
  if (isNaN(target)) {
    const raw = el.textContent.trim();
    // Extract leading prefix like "$"
    const prefixMatch = raw.match(/^([^0-9]*)/);
    prefix = prefixMatch ? prefixMatch[1] : '';
    // Extract the numeric part
    const numMatch = raw.match(/([\d.]+)/);
    if (!numMatch) return; // nothing to animate
    target = parseFloat(numMatch[1]);
    // Everything after the number is the suffix
    suffix = raw.slice(prefix.length + numMatch[1].length);
    decimals = numMatch[1].includes('.') ? numMatch[1].split('.')[1].length : 0;
  }

  duration = duration || 1400;
  const start = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-val, .outcome-num').forEach(el => {
      animateCounter(el, 1400);
    });
    statObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .outcomes-grid').forEach(el => statObs.observe(el));

// ===== OFFERING CARD HOVER GRADIENT =====
document.querySelectorAll('.offering-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Assessment Booked!';
    btn.style.background = '#27C93F';
    btn.style.color = '#000';
    showToast();
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      e.target.reset();
    }, 4000);
  }, 1400);
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

// ===== ACTIVE NAV HIGHLIGHT ON SCROLL =====
// Tracks: #offerings, #contact — highlights "Services" link when offerings is visible
const sectionsToTrack = document.querySelectorAll('section[id]');
const servicesLink = document.querySelector('.nav-links a[href="#offerings"]');

const secObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const sectionId = entry.target.id;

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.remove('active');
    });

    // Both "offerings" and "contact" should keep the Services link active
    if (sectionId === 'offerings' || sectionId === 'contact') {
      if (servicesLink) servicesLink.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

sectionsToTrack.forEach(s => secObs.observe(s));

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  const panel = item.querySelector('.faq-a');
  if (!btn || !panel) return;

  function toggleFaq(open) {
    if (open) {
      btn.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
    } else {
      btn.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
    }
  }

  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Close all other items (only one open at a time)
    faqItems.forEach(other => {
      if (other !== item) {
        const otherBtn   = other.querySelector('.faq-q');
        const otherPanel = other.querySelector('.faq-a');
        if (otherBtn)   otherBtn.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.classList.remove('open');
      }
    });

    toggleFaq(!isExpanded);
  });

  // Keyboard accessibility: Enter and Space already work natively on <button>,
  // but ensure explicit handling for non-button fallback elements
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// ===== VIDEO PLAY BUTTON — placeholder interaction =====
const playBtn = document.querySelector('.video-play-btn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    // Placeholder: replace with real modal/video embed
    playBtn.style.background = '#27C93F';
    setTimeout(() => { playBtn.style.background = ''; }, 800);
  });
  playBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playBtn.click(); }
  });
}

// ===== FLOATING CTA BAR =====
const floatingCta      = document.getElementById('floatingCta');
const floatingCtaClose = document.getElementById('floatingCtaClose');
const contactSection   = document.getElementById('contact');
let ctaClosed = false;

function updateFloatingCta() {
  if (!floatingCta || ctaClosed) return;

  const scrollY = window.scrollY;

  // Hide when near contact section (300px before it)
  if (contactSection) {
    const contactTop = contactSection.getBoundingClientRect().top + scrollY;
    if (scrollY + window.innerHeight > contactTop + 100) {
      floatingCta.classList.remove('visible');
      return;
    }
  }

  // Show after 600px scroll
  if (scrollY > 600) {
    floatingCta.classList.add('visible');
  } else {
    floatingCta.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateFloatingCta, { passive: true });

floatingCtaClose?.addEventListener('click', () => {
  ctaClosed = true;
  floatingCta.classList.remove('visible');
});

// Clicking the CTA button hides the bar
floatingCta?.querySelector('a')?.addEventListener('click', () => {
  ctaClosed = true;
  floatingCta.classList.remove('visible');
});

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateBackToTop, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Keyboard support for back to top
backToTop?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
