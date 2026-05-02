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