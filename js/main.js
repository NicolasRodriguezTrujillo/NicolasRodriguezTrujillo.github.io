document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({ duration: 800, once: true });

    // ===== MENÚ HAMBURGUESA =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }

    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // ===== FILTRADO DE PROYECTOS (CON CONTADORES AUTOMÁTICOS) =====
    function initProjectsFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return; // Si no hay grid, salir

        let allProjects = Array.from(document.querySelectorAll('.project-card'));

        // Reordenar proyectos: primero DATA, luego FRONTEND
        function reorderProjectsByCategory(order = ['data', 'frontend']) {
            const sorted = [...allProjects].sort((a, b) => {
                const catA = a.getAttribute('data-category');
                const catB = b.getAttribute('data-category');
                const indexA = order.indexOf(catA);
                const indexB = order.indexOf(catB);
                if (indexA !== indexB) return indexA - indexB;
                // Orden alfabético por título dentro de cada categoría
                const titleA = a.querySelector('.project-title')?.innerText || '';
                const titleB = b.querySelector('.project-title')?.innerText || '';
                return titleA.localeCompare(titleB);
            });
            sorted.forEach(project => projectsGrid.appendChild(project));
            allProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));
        }

        // Actualizar los números de los filtros
        function updateCounts() {
            const total = allProjects.length;
            const dataCount = allProjects.filter(p => p.getAttribute('data-category') === 'data').length;
            const frontendCount = allProjects.filter(p => p.getAttribute('data-category') === 'frontend').length;

            const countAll = document.getElementById('count-all');
            const countData = document.getElementById('count-data');
            const countFrontend = document.getElementById('count-frontend');

            if (countAll) countAll.innerText = total;
            if (countData) countData.innerText = dataCount;
            if (countFrontend) countFrontend.innerText = frontendCount;
        }

        // Filtrar según el botón seleccionado
        function filterProjects(filterValue) {
            // Mostrar/ocultar según categoría
            allProjects.forEach(project => {
                const category = project.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });

            // Reordenar según el filtro
            if (filterValue === 'all') {
                reorderProjectsByCategory(['data', 'frontend']);
            } else if (filterValue === 'data') {
                const visibleData = allProjects.filter(p => p.getAttribute('data-category') === 'data' && p.style.display !== 'none');
                visibleData.sort((a, b) => {
                    const titleA = a.querySelector('.project-title')?.innerText || '';
                    const titleB = b.querySelector('.project-title')?.innerText || '';
                    return titleA.localeCompare(titleB);
                });
                visibleData.forEach(project => projectsGrid.appendChild(project));
                allProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));
            } else if (filterValue === 'frontend') {
                const visibleFrontend = allProjects.filter(p => p.getAttribute('data-category') === 'frontend' && p.style.display !== 'none');
                visibleFrontend.sort((a, b) => {
                    const titleA = a.querySelector('.project-title')?.innerText || '';
                    const titleB = b.querySelector('.project-title')?.innerText || '';
                    return titleA.localeCompare(titleB);
                });
                visibleFrontend.forEach(project => projectsGrid.appendChild(project));
                allProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));
            }

            // Marcar botón activo
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === filterValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Asignar eventos a los botones
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.getAttribute('data-filter');
                filterProjects(filterValue);
            });
        });

        // Inicializar contadores y mostrar todos los proyectos ordenados
        updateCounts();
        filterProjects('all');
    }

    // Ejecutar el filtrado de proyectos
    initProjectsFilter();
});

/* Año automático en el footer */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/* Filtros de proyectos */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    /* Quito active de todos los botones */
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');

    document.querySelectorAll('.project-card:not(.coming-soon)').forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ============================================================
//  ABOUT ME — Animación de entrada tipo chat
//  Secuencia: puntitos → burbuja 1 → puntitos → burbuja 2 → ...
//  Se activa solo cuando el usuario llega a la sección con scroll.
// ============================================================
function initChatAnimation() {

  const block = document.querySelector('.chat-block');
  const rows  = document.querySelectorAll('.chat-row');
  const ts    = document.querySelector('.chat-timestamp');

  // Si no existe la sección, salimos
  if (!block || !rows.length) return;

  // Creo el indicador de "escribiendo..." y lo inserto al inicio del bloque
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-typing';
  typingEl.innerHTML = `
    <div class="chat-avatar-ghost"></div>
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  block.prepend(typingEl);

  // Tiempos en milisegundos — ajusta estos si quieres más rápido o más lento
  const TYPING_DURATION = 600;  // cuánto duran visibles los puntitos
  const BUBBLE_DELAY    = 200;  // pausa entre que se van los puntitos y aparece la burbuja
  const BETWEEN         = 300;  // respiro entre burbuja y los siguientes puntitos

  // Muestra los puntitos, espera, los esconde y resuelve
  function showTyping() {
    return new Promise(resolve => {
      typingEl.classList.add('visible');
      typingEl.classList.remove('hidden');

      setTimeout(() => {
        typingEl.classList.add('hidden');
        typingEl.classList.remove('visible');
        setTimeout(resolve, BUBBLE_DELAY);
      }, TYPING_DURATION);
    });
  }

  // Revela una fila con fade + slide y espera a que termine la transición CSS
  function showRow(row) {
    return new Promise(resolve => {
      row.classList.add('visible');
      setTimeout(resolve, 400); // igual a la duración del transition en CSS
    });
  }

  // Secuencia correcta: puntitos ANTES de cada burbuja, una por una
  async function runSequence() {
    for (let i = 0; i < rows.length; i++) {

      // 1. Puntitos
      await showTyping();

      // 2. Burbuja correspondiente
      await showRow(rows[i]);

      // 3. Pausa antes de la siguiente — excepto después de la última
      if (i < rows.length - 1) {
        await new Promise(r => setTimeout(r, BETWEEN));
      }
    }

    // Timestamp aparece justo al final
    if (ts) {
      setTimeout(() => ts.classList.add('visible'), 200);
    }
  }

  // IntersectionObserver: arranca la animación solo cuando
  // el usuario hace scroll hasta la sección, una sola vez
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runSequence();
        observer.disconnect(); // no se repite si vuelve a scrollear
      }
    });
  }, { threshold: 0.3 }); // arranca cuando el 30% de la sección es visible

  observer.observe(block);
}

/* ============================================================
   PARTÍCULAS DE FONDO
   Puntos morados flotando sutilmente en toda la página.
============================================================ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const count = 60;

for (let i = 0; i < count; i++) {
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

/* ============================================================
   TYPEWRITER
   Cambia entre tus roles automáticamente.
   Modifica el array 'roles' con los textos que quieras mostrar.
============================================================ */
const roles = ['Frontend Developer', 'Data Visualizer', 'Problem Solver', 'Building from Scratch'];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const typewriterEl = document.getElementById('typewriter');

function typeEffect() {
  const current = roles[roleIndex];
  if (!deleting) {
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, deleting ? 40 : 80);
}

typeEffect();

/* ============================================================
   PARALLAX 3D EN LA FOTO
   La foto se inclina suavemente según la posición del mouse.
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

// Ejecuto la función
initChatAnimation();