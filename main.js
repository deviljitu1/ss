/* =====================================================================
   SS INTERIOR'S — SHARED JAVASCRIPT
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL PROGRESS BAR ───────────────────────────────────────── */
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      scrollProgress.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── NAVBAR — scroll state + active link ───────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-whatsapp)');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    if (!navbar) return;
    // Scroll background (only if not .solid — inner pages are always solid)
    if (!navbar.classList.contains('solid')) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    // Active link highlight (for single-page scroll or current page)
    if (sections.length > 1) {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
      });
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── HAMBURGER MENU ────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobile() {
    if (!hamburger) return;
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobile);
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobile);
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu && mobileMenu.classList.contains('open')) toggleMobile();
    });
  });

  /* ── SCROLL-REVEAL ANIMATIONS (IntersectionObserver) ───────────── */
  const animElements = document.querySelectorAll(
    '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, ' +
    '.anim-scale-in, .anim-clip-reveal, .anim-clip-up, .anim-blur-in, .anim-rotate-in'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Also trigger children with stagger
        if (entry.target.classList.contains('stagger-children')) {
          entry.target.querySelectorAll(
            '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, ' +
            '.anim-scale-in, .anim-blur-in'
          ).forEach(child => child.classList.add('visible'));
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  animElements.forEach(el => revealObserver.observe(el));

  // Also observe stagger parents
  document.querySelectorAll('.stagger-children').forEach(el => revealObserver.observe(el));

  /* ── SPLIT TEXT ANIMATION ──────────────────────────────────────── */
  document.querySelectorAll('.split-text').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    let delayIndex = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        const space = document.createElement('span');
        space.className = 'letter-space';
        el.appendChild(space);
      } else {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = text[i];
        span.style.transitionDelay = (delayIndex * 0.03) + 's';
        el.appendChild(span);
        delayIndex++;
      }
    }
  });

  // Observe split-text elements
  document.querySelectorAll('.split-text').forEach(el => {
    const splitObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          splitObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    splitObserver.observe(el);
  });

  /* ── COUNTER ANIMATION ─────────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersDone = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersDone) {
        countersDone = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.dataset.target);
          const suffix = num.dataset.suffix || '+';
          const label = num.dataset.label;
          if (label) return;

          let count = 0;
          const increment = Math.max(1, Math.floor(target / 50));
          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            num.textContent = count + suffix;
          }, 35);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) counterObserver.observe(statsRow);

  /* ── PORTFOLIO FILTER TABS ─────────────────────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      portfolioItems.forEach((item, i) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transitionDelay = (i * 0.05) + 's';
        if (show) {
          item.classList.remove('hidden');
          item.style.display = '';
          // Force reflow and re-animate
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });

  /* ── HERO PARALLAX ─────────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroBg.style.transform = `translateY(${scroll * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }

  /* ── HERO PARTICLES ────────────────────────────────────────────── */
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      p.style.animationDuration = (8 + Math.random() * 15) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.opacity = (0.2 + Math.random() * 0.4);
      particlesContainer.appendChild(p);
    }
  }

  /* ── PAGE TRANSITION (for multi-page links) ────────────────────── */
  const pageTransition = document.querySelector('.page-transition');
  if (pageTransition) {
    // Animate out on load
    pageTransition.classList.add('leaving');
    setTimeout(() => {
      pageTransition.style.display = 'none';
    }, 600);

    // Animate in when navigating to another page
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
          e.preventDefault();
          pageTransition.style.display = 'block';
          pageTransition.classList.remove('leaving');
          pageTransition.classList.add('entering');
          setTimeout(() => {
            window.location.href = href;
          }, 500);
        }
      });
    });
  }

  /* ── 3D CARD TILT (desktop only) ───────────────────────────────── */
  if (window.innerWidth > 900) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;
        card.querySelector('.tilt-card-inner').style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.querySelector('.tilt-card-inner').style.transform =
          'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  /* ── SMOOTH SCROLL for hash links (fallback) ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── TESTIMONIALS AUTO SLIDER ──────────────────────────────────── */
  const testimonialsSlider = document.getElementById('testimonialsSlider');
  if (testimonialsSlider) {
    let currentIndex = 0;
    const cards = testimonialsSlider.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    
    setInterval(() => {
      currentIndex++;
      if (currentIndex >= totalCards - 2) { // Allow showing 3 cards on desktop
        currentIndex = 0;
        // Optional: remove transition for instant reset, then add back
      }
      
      const cardWidth = cards[0].offsetWidth;
      const gap = 28;
      const offset = (cardWidth + gap) * currentIndex;
      testimonialsSlider.style.transform = `translateX(-${offset}px)`;
    }, 3000);
  }

});
