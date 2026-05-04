// main.js (completo)
AOS.init({ duration: 800, once: true });

// Menú hamburguesa
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Animación círculos tecnologías
const circles = document.querySelectorAll('.circle-progress');
const circumference = 2 * Math.PI * 32;
circles.forEach(circle => {
  const pct = parseFloat(circle.getAttribute('data-pct'));
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);
});

// ----- FILTRADO DE PROYECTOS (nuevo) -----
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  // ... todo el código que ya funciona ...
}
initProjectsFilter();