/* ================================================================
   MAIN.JS — Portafolio de Nicolás Rodríguez
   Todo dentro de DOMContentLoaded para evitar errores de timing.
================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     AOS — Animaciones al hacer scroll
  ============================================================ */
  AOS.init({ duration: 800, once: true });


  /* ============================================================
     MENÚ HAMBURGUESA
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }


  /* ============================================================
     SCROLL SUAVE
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* ============================================================
     AÑO AUTOMÁTICO EN EL FOOTER
  ============================================================ */
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();


  /* ============================================================
     PARTÍCULAS DE FONDO
     Puntos morados flotando sutilmente en toda la página.
     Se apagan en móvil para mejor performance (ver CSS).
  ============================================================ */
  const canvas = document.getElementById('particles-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const COUNT = 60;

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }


  /* ============================================================
     TYPEWRITER EN EL HERO
     Cambia entre roles automáticamente con efecto de escritura.
     Modifica el array 'roles' con los textos que quieras.
  ============================================================ */
  const typewriterEl = document.getElementById('typewriter');

  if (typewriterEl) {
    const roles = ['Frontend Developer', 'Data Visualizer', 'Problem Solver', 'Building from Scratch'];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
      const current = roles[roleIndex];

      if (!deleting) {
        /* Escribiendo letra por letra */
        typewriterEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          /* Terminó de escribir — pausa antes de borrar */
          deleting = true;
          setTimeout(typeEffect, 1800);
          return;
        }
      } else {
        /* Borrando letra por letra */
        typewriterEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          /* Terminó de borrar — pasa al siguiente rol */
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(typeEffect, deleting ? 40 : 80);
    }

    typeEffect();
  }


  /* ============================================================
     PARALLAX 3D EN LA FOTO DEL HERO
     La foto se inclina suavemente según la posición del mouse.
     Se resetea cuando el mouse sale de la ventana.
  ============================================================ */
  const photoBox = document.getElementById('photo-box');

  if (photoBox) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      photoBox.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      photoBox.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  }


  /* ============================================================
     FILTRADO DE PROYECTOS
     Filtra por categoría y actualiza los contadores automáticamente.
  ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.querySelector('.projects-grid');

  if (projectsGrid && filterBtns.length) {

    /* Actualiza los contadores de cada filtro */
    function updateCounts() {
      const all = document.querySelectorAll('.project-card[data-category]');
      const data = document.querySelectorAll('.project-card[data-category="data"]');
      const frontend = document.querySelectorAll('.project-card[data-category="frontend"]');

      const countAll = document.getElementById('count-all');
      const countData = document.getElementById('count-data');
      const countFrontend = document.getElementById('count-frontend');

      if (countAll) countAll.textContent = all.length;
      if (countData) countData.textContent = data.length;
      if (countFrontend) countFrontend.textContent = frontend.length;
    }

    /* Muestra u oculta tarjetas según el filtro activo */
    function filterProjects(filterValue) {
      document.querySelectorAll('.project-card').forEach(card => {
        const category = card.getAttribute('data-category');
        if (!category) return; /* ignora los "coming soon" sin categoría */
        card.style.display = (filterValue === 'all' || filterValue === category) ? 'flex' : 'none';
      });

      /* Marca el botón activo */
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filterValue);
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => filterProjects(btn.getAttribute('data-filter')));
    });

    /* Inicializar */
    updateCounts();
    filterProjects('all');
  }


  /* ============================================================
     ABOUT ME — Animación de chat
     Secuencia: puntitos → burbuja 1 → puntitos → burbuja 2 → ...
     Se activa UNA SOLA VEZ cuando el usuario llega a la sección.
  ============================================================ */
  function initChatAnimation() {
    const block = document.querySelector('.chat-block');
    const rows  = document.querySelectorAll('.chat-row');
    const ts    = document.querySelector('.chat-timestamp');

    if (!block || !rows.length) return;

    /* Oculto todas las filas al inicio — el JS las revela en orden */
    rows.forEach(row => row.style.opacity = '0');
    if (ts) ts.style.opacity = '0';

    /* Creo el indicador de "escribiendo..." dinámicamente */
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-typing';
    typingEl.innerHTML = `
      <div class="chat-avatar-ghost"></div>
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    typingEl.style.opacity = '0';
    block.prepend(typingEl);

    /* Tiempos de la animación — ajusta a tu gusto */
    const TYPING_DURATION = 700;  /* cuánto duran visibles los puntitos */
    const BUBBLE_DELAY    = 150;  /* pausa entre puntitos y burbuja */
    const BETWEEN         = 400;  /* respiro entre burbuja y siguiente puntito */

    /* Muestra los puntitos con fade, espera, los esconde */
    function showTyping() {
      return new Promise(resolve => {
        typingEl.style.transition = 'opacity 0.2s ease';
        typingEl.style.opacity = '1';

        setTimeout(() => {
          typingEl.style.opacity = '0';
          setTimeout(resolve, BUBBLE_DELAY);
        }, TYPING_DURATION);
      });
    }

    /* Revela una fila con fade + slide suave */
    function showRow(row) {
      return new Promise(resolve => {
        row.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        row.style.transform = 'translateY(8px)';
        /* Doble rAF para que el browser aplique el estado inicial antes de animar */
        requestAnimationFrame(() => requestAnimationFrame(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }));
        setTimeout(resolve, 400);
      });
    }

    /* Secuencia: puntitos → burbuja → puntitos → burbuja → ... */
    async function runSequence() {
      for (let i = 0; i < rows.length; i++) {
        await showTyping();
        await showRow(rows[i]);
        if (i < rows.length - 1) {
          await new Promise(r => setTimeout(r, BETWEEN));
        }
      }
      /* Timestamp aparece al final con fade */
      if (ts) {
        ts.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { ts.style.opacity = '1'; }, 200);
      }
    }

    /* IntersectionObserver: arranca solo cuando la sección es visible */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runSequence();
          observer.disconnect(); /* no se repite */
        }
      });
    }, { threshold: 0.3 });

    observer.observe(block);
  }

  initChatAnimation();

}); /* fin DOMContentLoaded */