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
    const projectsGrid = document.querySelector('.projects-grid');
    let allProjects = Array.from(document.querySelectorAll('.project-card'));

    // Función para reordenar los proyectos en el DOM según la categoría (y opcionalmente por título)
    function reorderProjectsByCategory(order = ['data', 'frontend']) {
        // Ordenar el array: primero los que están en 'order' (data), luego frontend
        const sorted = [...allProjects].sort((a, b) => {
            const catA = a.getAttribute('data-category');
            const catB = b.getAttribute('data-category');
            const indexA = order.indexOf(catA);
            const indexB = order.indexOf(catB);
            if (indexA !== indexB) return indexA - indexB;
            // Si misma categoría, ordenar alfabéticamente por título (opcional)
            const titleA = a.querySelector('.project-title')?.innerText || '';
            const titleB = b.querySelector('.project-title')?.innerText || '';
            return titleA.localeCompare(titleB);
        });
        // Reinsertar en el DOM en el nuevo orden
        sorted.forEach(project => projectsGrid.appendChild(project));
        // Actualizar la referencia de allProjects con el nuevo orden
        allProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));
    }

    // Actualizar contadores
    function updateCounts() {
        const total = allProjects.length;
        const dataCount = allProjects.filter(p => p.getAttribute('data-category') === 'data').length;
        const frontendCount = allProjects.filter(p => p.getAttribute('data-category') === 'frontend').length;
        document.getElementById('count-all').innerText = total;
        document.getElementById('count-data').innerText = dataCount;
        document.getElementById('count-frontend').innerText = frontendCount;
    }

    // Filtrar y (opcionalmente) reordenar en "All"
    function filterProjects(filterValue) {
        allProjects.forEach(project => {
            const category = project.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === category) {
                project.style.display = 'flex';
            } else {
                project.style.display = 'none';
            }
        });

        // Si estamos en "All", reordenamos para que data vaya primero
        if (filterValue === 'all') {
            reorderProjectsByCategory(['data', 'frontend']);
        } else if (filterValue === 'data') {
            // Opcional: ordenar proyectos de data alfabéticamente
            const visibleData = allProjects.filter(p => p.getAttribute('data-category') === 'data' && p.style.display !== 'none');
            // Si quieres ordenarlos también, puedes hacerlo aquí (pero no es necesario por categoría única)
            // Ejemplo: ordenar por título
            visibleData.sort((a,b) => {
                const titleA = a.querySelector('.project-title')?.innerText || '';
                const titleB = b.querySelector('.project-title')?.innerText || '';
                return titleA.localeCompare(titleB);
            });
            // Reinsertar solo los visibles en orden
            visibleData.forEach(project => projectsGrid.appendChild(project));
            // Actualizar allProjects después de reordenar
            allProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));
        } else if (filterValue === 'frontend') {
            // Similar para frontend
            const visibleFrontend = allProjects.filter(p => p.getAttribute('data-category') === 'frontend' && p.style.display !== 'none');
            visibleFrontend.sort((a,b) => {
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

    // Event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            filterProjects(filterValue);
        });
    });

    // Inicialización
    updateCounts();
    filterProjects('all'); // muestra todo con data primero
}