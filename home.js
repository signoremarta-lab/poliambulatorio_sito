'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.home-menu');
if (menuToggle && menu) {
  function closeMenu() { menu.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }
  menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); } });
}
const track = document.querySelector('.specialty-track');
// The carousel is present only on the home page.
if (track) {
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
}
const form = document.querySelector('#collaborate-form');
if (form) form.addEventListener('submit', event => {
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

// Specialty cards share one template and one delegated click handler.
const specialtiesGrid = document.querySelector('#specialties-grid');
if (specialtiesGrid) {
  const specialties = [
    { name: 'Allergologia e Immunologia', image: 'allergologia.png', description: 'Si occupa della diagnosi e della gestione delle allergie e delle alterazioni del sistema immunitario, attraverso visite specialistiche e percorsi di valutazione personalizzati.' },
    { name: 'Cardiologia', image: 'cardiologia.png', description: "Si dedica alla prevenzione, alla diagnosi e al monitoraggio delle patologie del cuore e dell'apparato cardiovascolare, attraverso valutazioni e controlli specialistici." },
    { name: 'Anestesia e Terapia del Dolore (Longevità)', image: null, description: 'Si occupa della valutazione e del trattamento del dolore, con percorsi mirati al miglioramento della qualità della vita e del benessere della persona.' },
    { name: 'Ginecologia', image: 'ginecologia.png', description: 'Si occupa della salute della donna nelle diverse fasi della vita, attraverso visite, controlli e percorsi di prevenzione ginecologica.' },
    { name: 'Otorinolaringoiatria', image: null, description: 'Si dedica alla diagnosi e alla gestione dei disturbi di orecchio, naso e gola, attraverso valutazioni specialistiche e controlli mirati.' },
    { name: 'Endocrinologia e Diabetologia', image: null, description: 'Si occupa delle alterazioni ormonali, metaboliche e del diabete, attraverso valutazioni specialistiche e percorsi di monitoraggio.' },
    { name: 'Dermatologia', image: 'dermatologia.png', description: 'Si occupa della salute della pelle, dei capelli e delle unghie, attraverso visite dermatologiche, prevenzione e controlli specialistici.' },
    { name: 'Ecografia', image: null, description: 'Utilizza gli ultrasuoni per ottenere immagini degli organi e dei tessuti interni, fornendo un supporto diagnostico non invasivo.' },
    { name: 'Ortopedia', image: null, description: 'Si dedica alla diagnosi e alla gestione delle problematiche di ossa, articolazioni, muscoli e apparato muscolo-scheletrico.' },
    { name: 'Reumatologia', image: null, description: 'Si occupa delle patologie reumatiche e infiammatorie che interessano articolazioni e tessuti connettivi, attraverso valutazioni specialistiche.' }
  ];
  const booking = specialtiesGrid.querySelector('.specialties-booking');
  const cards = specialties.map(({ name, image, description }, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'specialty-flip';
    card.setAttribute('aria-label', name);
    card.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-controls', `specialty-back-${index}`);
    card.innerHTML = `<span class="specialty-flip-inner">
      <span class="specialty-flip-front">
        ${image ? `<img src="assets/${image}" alt="" loading="lazy" width="1080" height="1350">` : '<span class="specialty-photo-note">Fotografia in arrivo</span>'}
        <span class="specialty-flip-title">${name}</span><span class="diagonal-arrow" aria-hidden="true"></span>
      </span>
      <span class="specialty-flip-back" id="specialty-back-${index}" aria-hidden="true" inert>
        <strong>${name}</strong><span class="specialty-flip-description">${description}</span><span class="specialty-flip-return">↶ Torna indietro</span>
      </span>
    </span>`;
    return card;
  });
  booking.before(...cards);
  let opened = null;
  function setFlipped(card, flipped) {
    card.classList.toggle('is-flipped', flipped);
    card.setAttribute('aria-expanded', String(flipped));
    const front = card.querySelector('.specialty-flip-front');
    const back = card.querySelector('.specialty-flip-back');
    front.inert = flipped;
    back.inert = !flipped;
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    if (flipped) card.setAttribute('aria-describedby', back.id);
    else card.removeAttribute('aria-describedby');
  }
  specialtiesGrid.addEventListener('click', event => {
    const card = event.target.closest('.specialty-flip');
    if (!card || !specialtiesGrid.contains(card)) return;
    const flipped = card !== opened;
    if (opened) setFlipped(opened, false);
    setFlipped(card, flipped);
    opened = flipped ? card : null;
  });
}

// Chi siamo and Prenota use the same people and portrait renderer.
const equipeGrid = document.querySelector('#equipe-grid');
const bookingList = document.querySelector('#booking-list');
if ((equipeGrid || bookingList) && typeof equipe !== 'undefined') {
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function portrait(person, className) {
    if (person.immagine) {
      const image = element('img', className);
      image.src = person.immagine;
      image.alt = person.nome;
      image.loading = 'lazy';
      return image;
    }
    const placeholder = element('div', `${className} about-photo-placeholder`);
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', `Fotografia di ${person.nome} non disponibile`);
    const label = element('span', '', 'Fotografia in arrivo');
    label.setAttribute('aria-hidden', 'true');
    placeholder.append(label);
    return placeholder;
  }
  function personCard(person, booking) {
    const card = element('article', booking ? 'booking-card' : 'about-person');
    const name = element('h3', '', person.nome);
    const role = element('p', '', person.specializzazione);
    card.append(portrait(person, booking ? 'booking-card-image' : 'about-portrait'));
    if (booking) {
      const content = element('div', 'booking-card-content');
      content.append(name, role);
      const profile = element(person.profiloUrl ? 'a' : 'span', 'booking-profile', person.profiloUrl ? 'Visita il profilo' : 'Profilo non disponibile');
      if (person.profiloUrl) {
        profile.href = person.profiloUrl;
        profile.setAttribute('aria-label', `Visita il profilo di ${person.nome}`);
        const arrow = element('span', 'diagonal-arrow');
        arrow.setAttribute('aria-hidden', 'true');
        profile.append(arrow);
      }
      card.append(content, profile);
    } else card.append(name, role);
    return card;
  }
  function renderPeople(container, people, booking = false) {
    container.replaceChildren(...people.map(person => personCard(person, booking)));
  }
  if (equipeGrid) renderPeople(equipeGrid, equipe);
  if (bookingList) {
    const doctors = equipe.filter(person => person.categoria === 'medico');
    const search = document.querySelector('#doctor-search');
    const input = document.querySelector('#doctor-query');
    const status = document.querySelector('#booking-results-status');
    const empty = document.querySelector('#booking-empty');
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it').trim();
    function filterDoctors() {
      const terms = normalize(input.value).split(/\s+/).filter(Boolean);
      const matches = doctors.filter(person => {
        const searchable = normalize([person.nome, person.specializzazione, ...(person.paroleChiave || [])].join(' '));
        return terms.every(term => searchable.includes(term));
      });
      renderPeople(bookingList, matches, true);
      empty.hidden = matches.length !== 0;
      status.textContent = matches.length === 1 ? '1 medico trovato.' : `${matches.length} medici trovati.`;
    }
    search.addEventListener('submit', event => { event.preventDefault(); filterDoctors(); });
    input.addEventListener('input', filterDoctors);
    filterDoctors();
  }
}
