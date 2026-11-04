/**
 * ==============================================================================
 * PORTFÓLIO PESSOAL • MARIA EDUARDA
 * JavaScript Interativo, Animações e Micro-Interações
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. ATUALIZAÇÃO DO ANO NO RODAPÉ E RELÓGIO DE CAMPINAS
  // ----------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const campinasClock = document.getElementById('campinas-clock');
  function updateCampinasTime() {
    if (!campinasClock) return;
    try {
      const now = new Date();
      // Formata no fuso horário de São Paulo / Campinas
      const timeString = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);
      campinasClock.textContent = `Campinas, SP • ${timeString}`;
    } catch (e) {
      campinasClock.textContent = 'Campinas, SP • Brasil';
    }
  }
  updateCampinasTime();
  setInterval(updateCampinasTime, 30000);

  // ----------------------------------------------------------------------------
  // 2. CANVAS INTERATIVO DE PÉTALAS FLORAIS SUAVES (SAKURA DRIFT)
  // ----------------------------------------------------------------------------
  const canvas = document.getElementById('petals-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Redimensionamento responsivo
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalColors = [
      'rgba(255, 194, 209, 0.45)', // #FFC2D1
      'rgba(255, 179, 198, 0.40)', // #FFB3C6
      'rgba(255, 143, 171, 0.35)', // #FF8FAB
      'rgba(251, 111, 146, 0.25)'  // #FB6F92
    ];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = Math.random() * 9 + 7;
        this.speedX = Math.random() * 1.2 - 0.4;
        this.speedY = Math.random() * 1.1 + 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.oscillation = Math.random() * Math.PI * 2;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      }

      update() {
        this.oscillation += this.oscillationSpeed;
        this.x += this.speedX + Math.sin(this.oscillation) * 0.7;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Desenha formato orgânico de pétala de flor
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.6, this.size * 0.6);
        ctx.quadraticCurveTo(0, this.size, -this.size * 0.6, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Quantidade balanceada para leveza e elegância visual
    const numPetals = window.innerWidth < 768 ? 16 : 30;
    const petals = Array.from({ length: numPetals }, () => new Petal());

    let animationFrameId;
    let isVisible = true;

    function renderPetals() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      animationFrameId = requestAnimationFrame(renderPetals);
    }

    renderPetals();

    // Pausa a animação quando a aba não está visível para economia de processamento
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) {
        renderPetals();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 3. CURSOR PERSONALIZADO DELICADO COM SUAVIZAÇÃO (LERP)
  // ----------------------------------------------------------------------------
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('custom-cursor-follower');

  if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // O ponto central segue instantaneamente
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Interpolação linear para movimento suave do anel externo
    function animateCursor() {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Efeito de expansão ao passar sobre elementos interativos
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, .floating-tag, .bento-card, .skill-card, .project-card, .contact-channel-card'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('cursor-hover');
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 4. ANIMAÇÕES DE REVEAL AO ROLAR A PÁGINA (INTERSECTION OBSERVER)
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
              entry.target.classList.add('active');
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback para navegadores legados
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // ----------------------------------------------------------------------------
  // 5. NAVBAR FIXA, SOMBRA E DESTAQUE DE SEÇÃO ATIVA
  // ----------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-btn-cta)');

  function handleNavbarScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Adiciona classe de rolagem na navbar
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Identifica qual seção está visível na tela
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ----------------------------------------------------------------------------
  // 6. MENU MOBILE (HAMBURGER & DRAWER)
  // ----------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileMenu() {
    mobileToggle.classList.add('is-active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('is-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', closeMobileMenu);
    }

    // Fecha ao clicar em qualquer link da gaveta
    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Fecha ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 7. BOTÃO VOLTAR AO TOPO
  // ----------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 8. EFEITO MAGNÉTICO SUAVE NOS BOTÕES E INTERAÇÃO 3D NOS CARDS
  // ----------------------------------------------------------------------------
  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Efeito magnético em botões
    const actionButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-card-primary, .magnetic-btn');
    actionButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });

    // Efeito de movimento 3D suave nos cards dos projetos
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / (rect.height / 2)) * 4.5;
        const rotY = (x / (rect.width / 2)) * 4.5;
        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Parallax suave no card da tela inicial (Hero)
    const heroVisual = document.querySelector('.hero-visual');
    const heroCard = document.querySelector('.hero-glass-card');
    if (heroVisual && heroCard) {
      heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        heroCard.style.transform = `perspective(800px) rotateY(${(x * 4).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg) translateY(-4px)`;
      });

      heroVisual.addEventListener('mouseleave', () => {
        heroCard.style.transform = '';
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 9. FORMULÁRIO DE CONTATO & NOTIFICAÇÃO TOAST
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message, duration = 4000) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !message) {
        showToast('Por favor, preencha todos os campos! 🌸');
        return;
      }

      // Validação básica de formato de e-mail
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Por favor, insira um e-mail válido! 💌');
        return;
      }

      // Feedback visual elegante
      const submitBtn = document.getElementById('btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Enviando com carinho... 🌸</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast(`Obrigada pela mensagem, ${name}! Responderei em breve 🌸`);
      }, 1200);
    });
  }

  // ----------------------------------------------------------------------------
  // 10. MENSAGEM DE BOAS-VINDAS NO CONSOLE
  // ----------------------------------------------------------------------------
  console.log(
    '%c Maria Eduarda 🌸 %c Portfólio Web desenvolvido com carinho & código limpo!',
    'background: #FB6F92; color: #FFF; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'color: #FB6F92; font-weight: bold;'
  );
});

