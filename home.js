'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.home-menu');
function closeMenu() { menu.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); } });
const track = document.querySelector('.specialty-track');
const cards = [...track.children];
const dots = document.querySelector('.carousel-dots');
const status = document.querySelector('#carousel-status');
let page = 0;
let visible = 4;
let starts = [];
function renderCarousel() {
  const start = starts[page];
  const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
  track.style.transform = `translateX(-${start * step}px)`;
  cards.forEach((card, index) => {
    const shown = index >= start && index < start + visible;
    card.inert = !shown;
    card.setAttribute('aria-hidden', String(!shown));
  });
  [...dots.children].forEach((dot, index) => dot.setAttribute('aria-current', String(index === page)));
  status.textContent = `Pagina ${page + 1} di ${starts.length}`;
}
function configureCarousel() {
  visible = window.matchMedia('(max-width:440px)').matches ? 1 : window.matchMedia('(max-width:1000px)').matches ? 2 : 4;
  const stride = visible === 4 ? 2 : visible;
  starts = Array.from({ length: Math.ceil((cards.length - visible) / stride) + 1 }, (_, index) => Math.min(index * stride, cards.length - visible));
  page = Math.min(page, starts.length - 1);
  dots.replaceChildren(...starts.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostra la pagina ${index + 1}`);
    dot.addEventListener('click', () => { page = index; renderCarousel(); });
    return dot;
  }));
  renderCarousel();
}
document.querySelector('.carousel-prev').addEventListener('click', () => { page = (page - 1 + starts.length) % starts.length; renderCarousel(); });
document.querySelector('.carousel-next').addEventListener('click', () => { page = (page + 1) % starts.length; renderCarousel(); });
window.addEventListener('resize', configureCarousel);
configureCarousel();
const form = document.querySelector('#collaborate-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = document.querySelector('#contact-status');
  const link = document.querySelector('#contact-email-link');
  const body = `Nome e cognome: ${data.get('name')}\nIndirizzo email: ${data.get('email')}\nNumero di telefono: ${data.get('phone')}\nChi sono: ${data.get('role')}`;
  link.href = `mailto:info@poliambulatoriodevitis.it?subject=${encodeURIComponent('Richiesta di collaborazione')}&body=${encodeURIComponent(body)}`;
  message.textContent = 'Richiesta non inviata: apri il programma email per inviarla al poliambulatorio.';
  message.hidden = false;
  link.hidden = false;
});
