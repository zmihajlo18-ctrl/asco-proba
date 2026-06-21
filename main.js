'use strict';

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button, .usluga-kartica, .g-item, .zasto-kartica, .kontakt-stavka').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── KINETIC TYPOGRAPHY ──
function splitTitle() {
  const title = document.getElementById('hero-title');
  if (!title) return;

  const raw = title.innerHTML;
  // Split into lines preserving the <em> tag
  const lines = raw.split('<br>');
  let delay = 0.1;
  let result = '';

  lines.forEach((line, li) => {
    if (li > 0) result += '<br>';
    // strip tags temporarily to get words
    const isAccent = line.includes('<em>');
    const clean = line.replace(/<[^>]+>/g, '');
    const words = clean.trim().split(' ');

    words.forEach((word, wi) => {
      const cls = isAccent ? 'kt-word accent-word' : 'kt-word';
      result += `<span class="${cls}" style="animation-delay:${delay.toFixed(2)}s">${word}</span>`;
      if (wi < words.length - 1) result += ' ';
      delay += 0.12;
    });
  });

  title.innerHTML = result;
}
splitTitle();

// ── HERO PARTICLES ──
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ── PARALLAX HERO ──
const heroVideo = document.getElementById('hero-video');
function onScroll() {
  const sy = window.scrollY;
  if (heroVideo && sy < window.innerHeight) {
    heroVideo.style.transform = `translateY(${sy * 0.35}px)`;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// ── HEADER SCROLL ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ── STAGGER ITEMS ──
const staggerGroups = {};
document.querySelectorAll('.stagger-item').forEach(el => {
  const parent = el.parentElement;
  if (!staggerGroups[parent]) staggerGroups[parent] = [];
  staggerGroups[parent].push(el);
});

Object.values(staggerGroups).forEach(group => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        group.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.08 });
  if (group[0]) obs.observe(group[0]);
});

// ── COUNTER ANIMATION ──
const counters = document.querySelectorAll('.stat-broj[data-target]');
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const dur = 1800;
    const step = target / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.floor(cur);
    }, 16);
    cntObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cntObs.observe(c));

// ── ACTIVE NAV ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' });
  });
});

// ── LIGHTBOX ──
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbCounter = document.getElementById('lb-counter');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

const galleryItems = [...document.querySelectorAll('.g-item[data-lightbox]')];
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  const item = galleryItems[idx];
  lbImg.src = item.dataset.lightbox;
  lbImg.alt = item.dataset.caption || '';
  lbCaption.textContent = item.dataset.caption || '';
  lbCounter.textContent = `${idx + 1} / ${galleryItems.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

function prevImg() { openLightbox((currentIdx - 1 + galleryItems.length) % galleryItems.length); }
function nextImg() { openLightbox((currentIdx + 1) % galleryItems.length); }

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImg);
lbNext.addEventListener('click', nextImg);

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevImg();
  if (e.key === 'ArrowRight')  nextImg();
});

// Swipe support for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? nextImg() : prevImg();
});

// ── FORM SUBMIT ──
const forma = document.getElementById('kontakt-forma');
const submitBtn = document.getElementById('submit-btn');
forma.addEventListener('submit', e => {
  e.preventDefault();

  const ime     = document.getElementById('ime').value.trim();
  const telefon = document.getElementById('telefon').value.trim();
  const poruka  = document.getElementById('poruka').value.trim();

  if (!ime || !telefon || !poruka) {
    [['ime', ime], ['telefon', telefon], ['poruka', poruka]].forEach(([id, val]) => {
      const el = document.getElementById(id);
      el.style.borderColor = val ? '' : 'var(--amber)';
    });
    return;
  }

  const email  = document.getElementById('email').value.trim();
  const usluga = document.getElementById('usluga').value;

  const subject = `Upit za ${usluga || 'usluge'} – ${ime}`;
  const body =
    `Ime i prezime: ${ime}\n` +
    `Telefon: ${telefon}\n` +
    (email  ? `Email: ${email}\n`   : '') +
    (usluga ? `Usluga: ${usluga}\n` : '') +
    `\nOpis projekta:\n${poruka}`;

  window.location.href =
    `mailto:office@asco.rs?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  forma.reset();
});

// ── PRELOADER ──
function hidePreloader() {
  const p = document.getElementById('preloader');
  if (p) p.classList.add('hide');
}
window.addEventListener('load', () => setTimeout(hidePreloader, 450));
setTimeout(hidePreloader, 2800); // fallback ako se učitavanje oduži

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      if (o !== item) {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open', willOpen);
    q.setAttribute('aria-expanded', String(willOpen));
  });
});

// ── BACK TO TOP ──
const backTop = document.getElementById('back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── CURSOR HOVER ZA NOVE ELEMENTE ──
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.faq-q, .back-top, .logo').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
