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