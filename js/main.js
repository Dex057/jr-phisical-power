/* =========================================================
   Academia Jr Phisical Power — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav: abrir/fechar com foco e teclado ----------
     Segue o padrão de "disclosure" do WAI-ARIA: aria-expanded reflete o
     estado, Esc fecha e devolve o foco ao botão, e o menu fica `inert`
     (fora da ordem de tabulação) quando fechado no mobile, para que
     usuários de teclado não caiam em links invisíveis fora da tela. */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const mobileNavQuery = window.matchMedia('(max-width: 980px)');

  const syncNavInert = () => {
    const isMobile = mobileNavQuery.matches;
    const isOpen = mainNav.classList.contains('is-open');
    mainNav.inert = isMobile && !isOpen;
  };

  const openNav = () => {
    navToggle.classList.add('is-open');
    mainNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    navBackdrop.hidden = false;
    syncNavInert();
    mainNav.querySelector('a')?.focus();
  };
  const closeNav = ({ returnFocus = false } = {}) => {
    navToggle.classList.remove('is-open');
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    navBackdrop.hidden = true;
    syncNavInert();
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    if (mainNav.classList.contains('is-open')) closeNav();
    else openNav();
  });
  navBackdrop.addEventListener('click', () => closeNav());
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeNav());
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeNav({ returnFocus: true });
    }
  });
  mobileNavQuery.addEventListener('change', () => { closeNav(); });
  syncNavInert();

  /* ---------- Realce do link ativo no menu (via IntersectionObserver) ---------- */
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const setActive = id => {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.toggleAttribute('aria-current', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
      });
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Cursor glow (desktop, sem motion reduzido) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (!prefersReducedMotion && canHover) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const animateCursor = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursorGlow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  /* ---------- Vídeos de fundo (hero + CTA) ----------
     Se o arquivo de vídeo não existir, escondemos o <video> e mantemos o
     fallback estático. Com "reduzir movimento" ativado no sistema, nem
     tentamos carregar/tocar os vídeos — só decoração, não essenciais. */
  const heroVideo = document.getElementById('heroVideo');
  const heroFallbackImg = document.getElementById('heroFallbackImg');

  if (prefersReducedMotion) {
    document.querySelectorAll('video').forEach(video => {
      video.pause();
      video.removeAttribute('autoplay');
      video.style.display = 'none';
    });
  } else if (heroVideo) {
    heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; });
    heroVideo.addEventListener('loadeddata', () => {
      heroVideo.style.display = 'block';
      heroFallbackImg.style.opacity = '0';
    });
    // se não carregar em 3s, assume que não há vídeo ainda
    setTimeout(() => {
      if (heroVideo.readyState < 2) heroVideo.style.display = 'none';
    }, 3000);
  }

  /* ---------- Particles canvas (hero, sem motion reduzido) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.15,
        a: Math.random() * 0.6 + 0.2
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 255, 110, ${p.a})`;
        ctx.shadowColor = 'rgba(77,255,60,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize();
    initParticles();
    draw();
  }

  /* ---------- Scroll suave até âncoras internas ----------
     Easing próprio via requestAnimationFrame em vez de
     `scrollTo({behavior:'smooth'})`: em alguns navegadores/GPUs essa API
     nativa pode travar a rolagem por completo. Também:
     - atualiza a URL (histórico) para refletir a seção atual;
     - ignora cliques com modificador (Ctrl/Cmd/meio-clique) para não
       quebrar o "abrir em nova aba" nativo do navegador. */
  const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const smoothScrollTo = (targetY, duration = 600) => {
    if (prefersReducedMotion) { window.scrollTo(0, targetY); return; }
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();
    const step = now => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutQuad(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // deixa o navegador tratar
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      smoothScrollTo(top);
      history.pushState(null, '', id);
    });
  });

  /* ---------- Feature cards: spotlight seguindo o cursor ----------
     Sem tilt/levitação: são cards informativos, não links — inclinar em 3D
     como se fossem clicáveis induziria o usuário a esperar uma ação que
     não existe. */
  if (!prefersReducedMotion && canHover) {
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  /* ---------- GSAP scroll reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-visible')
      });
    });

    // parallax na foto da galeria (desativado com "reduzir movimento")
    const galleryImg = document.querySelector('.gallery-image');
    if (galleryImg && !prefersReducedMotion) {
      gsap.to(galleryImg, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryImg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  } else {
    // fallback without GSAP: reveal everything immediately
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  }

});
