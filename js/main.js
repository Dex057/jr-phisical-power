/* =========================================================
   Academia Jr Phisical Power — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    // não depende só da transição CSS: garante que pare de bloquear
    // cliques/scroll mesmo se algo atrasar a renderização.
    preloader.style.pointerEvents = 'none';
    setTimeout(() => { preloader.style.display = 'none'; }, 650);
  };
  window.addEventListener('load', () => setTimeout(hidePreloader, 400));
  // fallback caso 'load' demore (ex.: fontes/CDN lentos)
  setTimeout(hidePreloader, 2200);

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-open');
    mainNav.classList.toggle('is-open');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('is-open');
      mainNav.classList.remove('is-open');
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Cursor glow (desktop) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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

  /* ---------- Hero video fallback ----------
     Se o arquivo assets/video/hero-loop.mp4 não existir (ainda não gerado
     no Google Flow), escondemos o <video> e mantemos a imagem estática. */
  const heroVideo = document.getElementById('heroVideo');
  const heroFallbackImg = document.getElementById('heroFallbackImg');
  if (heroVideo) {
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

  /* ---------- Particles canvas (hero) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
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

  /* ---------- Smooth anchor scroll offset for fixed header ----------
     Implementamos nosso próprio easing via requestAnimationFrame em vez de
     depender de `scrollTo({behavior:'smooth'})`: em alguns navegadores/GPUs
     essa API nativa pode travar a rolagem por completo, então preferimos
     não confiar nela para algo essencial como a navegação do menu. */
  const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const smoothScrollTo = (targetY, duration = 600) => {
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
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      smoothScrollTo(top);
    });
  });

  /* ---------- Feature cards: tilt 3D + spotlight seguindo o cursor ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.feature-card').forEach(card => {
      const maxTilt = 8; // graus
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        const rotY = (px - 0.5) * maxTilt * 2;
        const rotX = (0.5 - py) * maxTilt * 2;
        card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
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

    // parallax on gallery image
    const galleryImg = document.querySelector('.gallery-image');
    if (galleryImg) {
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
