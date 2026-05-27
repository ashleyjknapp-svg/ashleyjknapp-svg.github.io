/* =====================================================
   NAV — scrolled shadow + mobile toggle
===================================================== */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =====================================================
   SCROLL FADE-IN — IntersectionObserver
===================================================== */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach((el, i) => {
  // Stagger siblings in the same parent
  const siblings = el.parentElement.querySelectorAll('.fade-in');
  if (siblings.length > 1) {
    const idx = Array.from(siblings).indexOf(el);
    el.style.transitionDelay = `${idx * 0.1}s`;
  }
  fadeObserver.observe(el);
});

/* =====================================================
   COUNT-UP ANIMATION — stats bar
===================================================== */
function animateCount(el) {
  const target  = parseInt(el.dataset.target, 10);
  const prefix  = el.dataset.prefix  || '';
  const suffix  = el.dataset.suffix  || '';
  const duration = 1100;
  const fps      = 40;
  const interval = duration / fps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    const progress = step / fps;
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (step >= fps) {
      el.textContent = prefix + target + suffix;
      clearInterval(timer);
    }
  }, interval);
}

const statsSection = document.querySelector('.stats');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat__number').forEach(animateCount);
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);

/* =====================================================
   ACTIVE NAV LINK — highlight on scroll
===================================================== */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.querySelectorAll('a').forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'rgba(255,255,255,1)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));
