// ============================
// 🧭 NAVEGACIÓN Y MENÚ
// ============================
const hamburguesa = document.getElementById('hamburguesa');
const menu = document.getElementById('menu');

if (hamburguesa && menu) {
  hamburguesa.addEventListener('click', () => {
    menu.classList.toggle('active');
    hamburguesa.classList.toggle('active');
    const activo = menu.classList.contains('active');
    document.body.classList.toggle('no-scroll', activo);
  });

  // 🔥 Cerrar menú al hacer clic en un enlace
  menu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      menu.classList.remove('active');
      hamburguesa.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

// ============================
// 📖 SECCIÓN "LEER MÁS"
// ============================
function toggleTexto(event) {
  event.preventDefault();
  const textoMas = document.getElementById('texto');
  const btn = document.getElementById('btn-leer-mas');

  if (textoMas) {
    textoMas.classList.toggle('visible');
    if (btn) {
      const isVisible = textoMas.classList.contains('visible');
      btn.innerHTML = isVisible ? 'Leer menos <i class="fas fa-chevron-up"></i>' : 'Leer más <i class="fas fa-chevron-down"></i>';
      btn.classList.toggle('open', isVisible);
    }
  }
}

// ============================
// 🎠 CARRUSEL DE IMÁGENES
// ============================
const slides = document.querySelectorAll('.carousel-slide');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const indicadores = document.getElementById('indicadores');

let indice = 0;

if (slides.length > 0) {
  function mostrarSlide(nuevoIndice) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[nuevoIndice]) {
      slides[nuevoIndice].classList.add('active');
      actualizarIndicadores(nuevoIndice);
    }
  }

  function actualizarIndicadores(nuevoIndice) {
    const puntos = document.querySelectorAll('.carousel-indicators span');
    puntos.forEach(p => p.classList.remove('activo'));
    if (puntos[nuevoIndice]) {
      puntos[nuevoIndice].classList.add('activo');
    }
  }

  slides.forEach((_, i) => {
    const punto = document.createElement('span');
    if (i === 0) punto.classList.add('activo');
    punto.addEventListener('click', () => {
      indice = i;
      mostrarSlide(indice);
    });
    indicadores.appendChild(punto);
  });

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      indice = (indice + 1) % slides.length;
      mostrarSlide(indice);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      indice = (indice - 1 + slides.length) % slides.length;
      mostrarSlide(indice);
    });
  }

  setInterval(() => {
    indice = (indice + 1) % slides.length;
    mostrarSlide(indice);
  }, 3000);
}
