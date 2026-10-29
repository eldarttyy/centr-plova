import { MENU, TAG_LABELS } from './menu-data.js';
import { BRANCHES, DELIVERY, reviewUrl, mapEmbed, directionsUrl } from './site-config.js';

const { gsap, ScrollTrigger, Lenis } = window;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = Boolean(gsap && ScrollTrigger);

document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   Smooth scroll
   --------------------------------------------------------- */
let lenis = null;
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (Lenis && !reduceMotion) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  if (hasGsap) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}

function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.4 });
  else document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2 || !document.querySelector(id)) return;
    e.preventDefault();
    closeDrawer();
    scrollToTarget(id === '#top' ? 0 : id);
  });
});

/* ---------------------------------------------------------
   Intro (steaming kazan) — shown once per session
   --------------------------------------------------------- */
const intro = document.getElementById('intro');

function seenIntro() {
  try { return sessionStorage.getItem('cp-intro') === '1'; } catch { return false; }
}
function markIntro() {
  try { sessionStorage.setItem('cp-intro', '1'); } catch { /* storage blocked */ }
}

function buildRays() {
  const g = intro.querySelector('.intro__rays');
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', 100 + Math.cos(a) * 58);
    line.setAttribute('y1', 100 + Math.sin(a) * 58);
    line.setAttribute('x2', 100 + Math.cos(a) * (i % 2 ? 70 : 80));
    line.setAttribute('y2', 100 + Math.sin(a) * (i % 2 ? 70 : 80));
    g.appendChild(line);
  }
  return g.querySelectorAll('line');
}

function heroIn() {
  if (!hasGsap || reduceMotion) return;
  gsap.from('.hero__title .line > span', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.12 });
  gsap.from(['.hero__eyebrow', '.hero__lede', '.hero__ctas', '.hero__meta'], {
    opacity: 0, y: 24, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.25,
  });
  gsap.from('.hero__video', { opacity: 0, yPercent: 8, duration: 1.6, ease: 'expo.out', stagger: 0.15 });
}

function endIntro(fast = false) {
  markIntro();
  intro.classList.add('is-done');
  document.body.classList.remove('is-locked');
  lenis?.start();
  if (hasGsap && !fast) {
    gsap.to(intro, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onComplete: () => intro.remove() });
    gsap.delayedCall(0.45, heroIn);
  } else {
    intro.remove();
    heroIn();
  }
}

if (seenIntro() || reduceMotion || !hasGsap) {
  intro.remove();
  heroIn();
} else {
  document.body.classList.add('is-locked');
  lenis?.stop();
  const rays = buildRays();
  const tl = gsap.timeline({ onComplete: () => endIntro() });
  tl.from('.intro__tunduk', { scale: 0.4, opacity: 0, y: 20, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' })
    .from(rays, { opacity: 0, scale: 0.6, transformOrigin: '100px 100px', duration: 0.6, stagger: 0.012, ease: 'power2.out' }, '-=0.6')
    .from('.intro__word span', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' }, '-=0.5')
    .to('.intro__rays', { rotate: 30, transformOrigin: '100px 100px', duration: 1.4, ease: 'power1.inOut' }, '-=0.8');
  intro.querySelector('.intro__skip').addEventListener('click', () => { tl.kill(); endIntro(true); });
}

/* ---------------------------------------------------------
   Nav: solid on scroll, hide on scroll down
   --------------------------------------------------------- */
const nav = document.getElementById('nav');
let lastY = 0;
function onScroll(y) {
  nav.classList.toggle('is-scrolled', y > 40);
  nav.classList.toggle('is-hidden', y > lastY && y > 400 && !drawerOpen());
  lastY = y;
}
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

/* ---------------------------------------------------------
   Mobile drawer
   --------------------------------------------------------- */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
const drawerOpen = () => burger.getAttribute('aria-expanded') === 'true';

function openDrawer() {
  drawer.hidden = false;
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Закрыть меню');
  document.body.classList.add('is-locked');
  lenis?.stop();
  if (hasGsap && !reduceMotion) {
    gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' });
    gsap.from('.drawer nav a', { y: 40, opacity: 0, stagger: 0.06, duration: 0.7, ease: 'expo.out', delay: 0.25 });
  }
}
function closeDrawer() {
  if (!drawerOpen()) return;
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
  document.body.classList.remove('is-locked');
  lenis?.start();
  drawer.hidden = true;
}
burger.addEventListener('click', () => (drawerOpen() ? closeDrawer() : openDrawer()));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

/* ---------------------------------------------------------
   Menu
   --------------------------------------------------------- */
const tabsEl = document.getElementById('menuTabs');
const panelEl = document.getElementById('menuPanel');
const money = (p) => `${Array.isArray(p) ? p.join(' / ') : p} с`;

function renderCategory(cat) {
  panelEl.setAttribute('aria-labelledby', `tab-${cat.id}`);
  panelEl.innerHTML = cat.items.map((item) => `
    <article class="menu-item">
      <div>
        <h3 class="menu-item__name">${item.name}</h3>
        ${item.portion ? `<span class="menu-item__native">${item.portion}</span>` : ''}
      </div>
      <span class="menu-item__price">${money(item.price)}</span>
      ${item.desc ? `<p class="menu-item__desc">${item.desc}</p>` : ''}
      ${item.tags?.length ? `<div class="menu-item__tags">${item.tags.map((t) => `<span class="tag tag--${t}">${TAG_LABELS[t]}</span>`).join('')}</div>` : ''}
    </article>`).join('');
  if (hasGsap && !reduceMotion) {
    gsap.from(panelEl.children, { y: 24, opacity: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out' });
  }
}

MENU.forEach((cat, i) => {
  const b = document.createElement('button');
  b.className = 'menu__tab';
  b.id = `tab-${cat.id}`;
  b.type = 'button';
  b.role = 'tab';
  b.textContent = cat.label;
  b.setAttribute('aria-selected', String(i === 0));
  b.tabIndex = i === 0 ? 0 : -1;
  b.addEventListener('click', () => selectTab(i));
  tabsEl.appendChild(b);
});

function selectTab(i) {
  [...tabsEl.children].forEach((b, j) => {
    b.setAttribute('aria-selected', String(i === j));
    b.tabIndex = i === j ? 0 : -1;
  });
  renderCategory(MENU[i]);
  ScrollTrigger?.refresh();
}
tabsEl.addEventListener('keydown', (e) => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
  const tabs = [...tabsEl.children];
  const cur = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
  const next = (cur + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  selectTab(next);
  tabs[next].focus();
});
renderCategory(MENU[0]);

/* ---------------------------------------------------------
   Delivery apps (buttons show only once configured)
   --------------------------------------------------------- */
document.querySelectorAll('[data-delivery]').forEach((el) => {
  const url = DELIVERY[el.dataset.delivery];
  if (url) { el.href = url; el.hidden = false; }
  else el.hidden = true;
});

/* ---------------------------------------------------------
   Branches: cards + map
   --------------------------------------------------------- */
const branchesEl = document.getElementById('branches');
const branchMap = document.getElementById('branchMap');

branchesEl.innerHTML = BRANCHES.map((b, i) => `
  <article class="branch reveal${i === 0 ? ' is-active' : ''}" data-i="${i}">
    <button class="branch__head" type="button" role="tab" aria-selected="${i === 0}" aria-controls="branchMap">
      <span class="branch__num">0${i + 1}</span>
      <span class="branch__name">${b.name}</span>
      <span class="branch__rating">★ ${b.rating}</span>
    </button>
    <p class="branch__addr">${b.address}</p>
    <p class="branch__hours">${b.hours}</p>
    <div class="branch__actions">
      <a class="btn btn--solid" href="tel:${b.phone}">${b.phoneLabel}</a>
      <a class="link-arrow" href="${directionsUrl(b)}" target="_blank" rel="noopener">Маршрут</a>
      <a class="link-arrow" href="${b.twoGis}" target="_blank" rel="noopener">2ГИС</a>
    </div>
    <ul class="branch__tags">${b.features.map((f) => `<li>${f}</li>`).join('')}</ul>
  </article>`).join('');

function selectBranch(i) {
  [...branchesEl.children].forEach((el, j) => {
    el.classList.toggle('is-active', i === j);
    el.querySelector('.branch__head').setAttribute('aria-selected', String(i === j));
  });
  branchMap.src = mapEmbed(BRANCHES[i]);
  branchMap.title = `Карта: «Центр Плова», ${BRANCHES[i].address}`;
}
branchesEl.querySelectorAll('.branch__head').forEach((btn, i) => btn.addEventListener('click', () => selectBranch(i)));
selectBranch(0);

/* ---------------------------------------------------------
   Rate your visit — every rating goes to 2GIS (no filtering)
   --------------------------------------------------------- */
const pickEl = document.getElementById('reviewBranches');
const reviewLink = document.getElementById('reviewLink');
const qrEl = document.getElementById('reviewQr');
let reviewBranch = BRANCHES[0];

function drawQr(url) {
  if (!window.qrcode) { qrEl.hidden = true; return; }
  const qr = window.qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  qrEl.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
}

function setReviewBranch(i) {
  reviewBranch = BRANCHES[i];
  reviewLink.href = reviewUrl(reviewBranch);
  [...pickEl.children].forEach((b, j) => b.setAttribute('aria-checked', String(i === j)));
  drawQr(reviewUrl(reviewBranch));
}
pickEl.innerHTML = BRANCHES.map((b, i) => `<button type="button" role="radio" aria-checked="${i === 0}">${b.name}</button>`).join('');
[...pickEl.children].forEach((b, i) => b.addEventListener('click', () => setReviewBranch(i)));
setReviewBranch(0);

const stars = [...document.querySelectorAll('#stars button')];
const starsHint = document.getElementById('starsHint');
const HINTS = ['', 'Спасибо, что рассказали — мы читаем каждый отзыв.', 'Спасибо — напишите, что нам исправить.', 'Спасибо! Что сделать, чтобы в следующий раз было пять?', 'Рахмат! Расскажите другим, что вам понравилось.', 'Рахмат! Расскажите другим, что вам понравилось.'];
const starWord = (n) => (n === 1 ? 'звезду' : n < 5 ? 'звезды' : 'звёзд');
let chosen = 0;
const paint = (n) => stars.forEach((b, i) => b.classList.toggle('is-on', i < n));
stars.forEach((b, i) => {
  b.addEventListener('mouseenter', () => paint(i + 1));
  b.addEventListener('focus', () => paint(i + 1));
  b.addEventListener('click', () => {
    chosen = i + 1;
    paint(chosen);
    stars.forEach((s2, j) => s2.setAttribute('aria-pressed', String(j === i)));
    starsHint.textContent = `${HINTS[chosen]} Открываем 2ГИС — поставьте там ${chosen} ${starWord(chosen)}.`;
    window.open(reviewUrl(reviewBranch), '_blank', 'noopener');
  });
});
document.getElementById('stars').addEventListener('mouseleave', () => paint(chosen));

document.getElementById('copyReview').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const url = reviewUrl(reviewBranch);
  try {
    await navigator.clipboard.writeText(url);
    btn.textContent = 'Скопировано ✓';
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: url });
    document.body.appendChild(ta);
    ta.select();
    btn.textContent = document.execCommand('copy') ? 'Скопировано ✓' : 'Не удалось';
    ta.remove();
  }
  setTimeout(() => { btn.textContent = 'Скопировать ссылку'; }, 2200);
});

/* ---------------------------------------------------------
   Reviews rotator
   --------------------------------------------------------- */
const voices = [...document.querySelectorAll('.voice')];
const voiceIndex = document.getElementById('voiceIndex');
let vi = 0;
setInterval(() => {
  voices[vi].classList.remove('is-active');
  vi = (vi + 1) % voices.length;
  voices[vi].classList.add('is-active');
  voiceIndex.textContent = vi + 1;
}, 5500);

/* ---------------------------------------------------------
   Lazy final video
   --------------------------------------------------------- */
const lazyVideo = document.querySelector('[data-lazy-video]');
new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { lazyVideo.play().catch(() => {}); }
    else if (!lazyVideo.paused) lazyVideo.pause();
  });
}, { rootMargin: '200px' }).observe(lazyVideo);

/* ---------------------------------------------------------
   Scroll animations
   --------------------------------------------------------- */
if (hasGsap && !reduceMotion) {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // Hero reels drift apart as you leave
  gsap.to('.hero__reels', {
    yPercent: 10, scale: 1.12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  gsap.from('.story__inset', {
    y: 80, opacity: 0, duration: 1.4, ease: 'expo.out',
    scrollTrigger: { trigger: '.story__media', start: 'top 70%' },
  });

  // Ornament bands slide sideways like a carpet being unrolled
  gsap.utils.toArray('.pattern-band svg').forEach((svg) => {
    gsap.fromTo(svg, { x: 0 }, {
      x: -120, ease: 'none',
      scrollTrigger: { trigger: svg, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Hall photos zoom gently into place
  gsap.utils.toArray('.h img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.18 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'center center', scrub: true },
    });
  });

  // Horizontal gallery (desktop only)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const track = document.getElementById('galleryTrack');
    const distance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: '.gallery', start: 'top top', end: () => `+=${distance()}`,
        pin: true, scrub: 0.6, invalidateOnRefresh: true,
      },
    });
  });

  gsap.from('.final__content > *', {
    y: 50, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out',
    scrollTrigger: { trigger: '.final', start: 'top 60%' },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  document.querySelectorAll('.reveal').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
}

/* ---------------------------------------------------------
   3D dishes — loaded lazily when the section approaches
   --------------------------------------------------------- */
const stage = document.getElementById('signature');
new IntersectionObserver(async (entries, io) => {
  if (!entries[0].isIntersecting) return;
  io.disconnect();
  try {
    const { initDishes } = await import('./dishes3d.js');
    initDishes({
      canvas: document.getElementById('dishCanvas'),
      ui: {
        index: document.getElementById('dishIndex'),
        total: document.getElementById('dishTotal'),
        name: document.getElementById('dishName'),
        native: document.getElementById('dishNative'),
        desc: document.getElementById('dishDesc'),
        prev: document.getElementById('dishPrev'),
        next: document.getElementById('dishNext'),
      },
      reduceMotion,
    });
  } catch (err) {
    console.error('[CentrPlova] 3D failed', err);
    document.querySelector('.stage-fallback').hidden = false;
  }
}, { rootMargin: '600px' }).observe(stage);
