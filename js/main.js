 AOS.init({
            duration: 800,   /* duración de cada animación en milisegundos */
            once: true       /* la animación solo ocurre una vez al hacer scroll */
        });

 const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        hamburger.addEventListener('click', function() {
            /* Agrego o quito la clase 'open' para mostrar/ocultar el menú */
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/*
  Animo los círculos de progreso de las tecnologías.
  Calculo el stroke-dashoffset según el porcentaje de cada tecnología.
  La circunferencia del círculo es 2 * PI * 32 ≈ 201.
*/
const circumference = 2 * Math.PI * 32;

document.querySelectorAll('.circle-progress').forEach(circle => {
  const pct = parseFloat(circle.getAttribute('data-pct'));
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 300);
});