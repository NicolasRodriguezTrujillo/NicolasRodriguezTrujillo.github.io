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

    // ===== ANIMACIÓN CÍRCULOS DE TECNOLOGÍAS =====
    const circles = document.querySelectorAll('.circle-progress');
    const circumference = 2 * Math.PI * 32;
    circles.forEach(circle => {
        const pct = parseFloat(circle.getAttribute('data-pct'));
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);
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