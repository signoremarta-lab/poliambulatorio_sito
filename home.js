'use strict';
const landingPage = document.querySelector('.index2-page');
if (landingPage && typeof IntersectionObserver === 'function' &&
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      revealObserver.unobserve(target);
    });
  }, { threshold: 0.08 });
  landingPage.querySelectorAll('.landing-newsletter, .home-section-heading, .landing-story .about-copy, .landing-mosaic .about-room, .info-grid > div:first-child, .info-panels article').forEach(element => {
    revealObserver.observe(element);
    element.classList.add('reveal');
  });
}

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
// Specialty cards share one template and one delegated click handler.
const specialtiesGrid = document.querySelector('#specialties-grid');
if (specialtiesGrid) {
  const specialties = [
    { name: 'Allergologia e Immunologia', image: 'allergologia_immunologia.png', description: 'Si occupa della diagnosi e della gestione delle allergie e delle alterazioni del sistema immunitario, attraverso visite specialistiche e percorsi di valutazione personalizzati.' },
    { name: 'Cardiologia', image: 'cardiologia.png', description: "Si dedica alla prevenzione, alla diagnosi e al monitoraggio delle patologie del cuore e dell'apparato cardiovascolare, attraverso valutazioni e controlli specialistici." },
    { name: 'Medicina del Dolore', image: 'medicina_del_dolore.png', description: 'Si occupa della valutazione e del trattamento del dolore, con percorsi mirati al miglioramento della qualità della vita e del benessere della persona.' },
    { name: 'Ginecologia e Ostetricia', image: 'ginecologia_ostetricia.png', description: 'Si occupa della salute della donna nelle diverse fasi della vita, attraverso visite, controlli e percorsi di prevenzione ginecologica.' },
    { name: 'Otorinolaringoiatria', image: 'otorinolaringoiatria.png', description: 'Si dedica alla diagnosi e alla gestione dei disturbi di orecchio, naso e gola, attraverso valutazioni specialistiche e controlli mirati.' },
    { name: 'Endocrinologia e Diabetologia', image: 'endocrinologia_diabetologia.png', description: 'Si occupa delle alterazioni ormonali, metaboliche e del diabete, attraverso valutazioni specialistiche e percorsi di monitoraggio.' },
    { name: 'Dermatologia', image: 'dermatologia.png', description: 'Si occupa della salute della pelle, dei capelli e delle unghie, attraverso visite dermatologiche, prevenzione e controlli specialistici.' },
    { name: 'Medicina Interna e Ecografia', image: 'medicina_interna_ecografia.png', description: 'Utilizza gli ultrasuoni per ottenere immagini degli organi e dei tessuti interni, fornendo un supporto diagnostico non invasivo.' },
    { name: 'Ortopedia', image: 'ortopedia.png', description: 'Si dedica alla diagnosi e alla gestione delle problematiche di ossa, articolazioni, muscoli e apparato muscolo-scheletrico.' },
    { name: 'Reumatologia', image: 'reumatologia.png', description: 'Si occupa delle patologie reumatiche e infiammatorie che interessano articolazioni e tessuti connettivi, attraverso valutazioni specialistiche.' }
  ];
  const booking = specialtiesGrid.querySelector('.specialties-booking');
  const cards = specialties.map(({ name, image, description }, index) => {
    const card = document.createElement('div');
    card.className = 'specialty-flip';
    card.innerHTML = `
      <button type="button" class="specialty-flip-front" aria-expanded="false" aria-controls="specialty-back-${index}">
        ${image ? `<img src="assets/${image}" alt="" loading="lazy" width="1080" height="1350">` : '<span class="specialty-photo-note">Fotografia in arrivo</span>'}
        <span class="specialty-flip-title">${name}</span><span class="diagonal-arrow" aria-hidden="true"></span>
      </button>
      <div class="specialty-flip-back" id="specialty-back-${index}" aria-hidden="true" inert>
        <strong>${name}</strong>
        <p class="specialty-flip-description">${description}</p>
        <div class="specialty-flip-actions">
          <a class="specialty-flip-book" href="prenota.html">Prenota</a>
          <button type="button" class="specialty-flip-return">↶ Torna indietro</button>
        </div>
      </div>`;
    return card;
  });
  booking.before(...cards);
  let opened = null;
  function setFlipped(card, flipped) {
    card.classList.toggle('is-flipped', flipped);
    const front = card.querySelector('.specialty-flip-front');
    const back = card.querySelector('.specialty-flip-back');
    front.setAttribute('aria-expanded', String(flipped));
    front.inert = flipped;
    back.inert = !flipped;
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
  }
  specialtiesGrid.addEventListener('click', event => {
    const control = event.target.closest('.specialty-flip-front, .specialty-flip-return');
    if (!control) return;
    const card = control.closest('.specialty-flip');
    const flipped = control.classList.contains('specialty-flip-front');
    if (opened && opened !== card) setFlipped(opened, false);
    setFlipped(card, flipped);
    opened = flipped ? card : null;
    card.querySelector(flipped ? '.specialty-flip-return' : '.specialty-flip-front').focus({ preventScroll: true });
  });
}

// Chi siamo, Prenota and the profiles share the same people and portraits.
const equipeGrid = document.querySelector('#equipe-grid');
const bookingList = document.querySelector('#booking-list');
const doctorProfile = document.querySelector('#doctor-profile');
if ((equipeGrid || bookingList || doctorProfile) && typeof equipe !== 'undefined') {
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
  function bookingSpecialty(person) {
    return person.specializzazionePrenota
      ? `Specialista in ${person.specializzazionePrenota}`
      : person.specializzazione;
  }
  function personCard(person, booking, profileHero = false) {
    const card = element('article', booking ? 'booking-card' : 'about-person');
    const name = element(profileHero ? 'h1' : 'h3', '', person.nome);
    const role = element('p', '', booking ? bookingSpecialty(person) : person.specializzazione);
    if (booking || person.immagine) {
      card.append(portrait(person, booking ? 'booking-card-image' : 'about-portrait'));
    }
    if (booking) {
      const content = element('div', 'booking-card-content');
      content.append(name, role);
      card.append(content);
      if (!profileHero) {
        const profile = element('a', 'booking-profile', 'Visita il profilo');
        profile.href = person.profiloUrl || `medico.html?id=${encodeURIComponent(person.id)}`;
        profile.setAttribute('aria-label', `Visita il profilo di ${person.nome}`);
        const arrow = element('span', 'diagonal-arrow');
        arrow.setAttribute('aria-hidden', 'true');
        profile.append(arrow);
        card.append(profile);
      }
    } else card.append(name, role);
    return card;
  }
  function renderPeople(container, people, booking = false) {
    container.replaceChildren(...people.map(person => personCard(person, booking)));
  }
  if (equipeGrid) {
    const booking = equipeGrid.querySelector('.about-booking');
    renderPeople(equipeGrid, equipe);
    equipeGrid.append(booking);
    equipeGrid.style.setProperty('--about-people', equipe.length);
  }
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
        const searchable = normalize([
          person.nome, person.specializzazione, person.specializzazionePrenota,
          ...(person.paroleChiave || []), ...(person.prestazioni || [])
        ].join(' '));
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
  if (doctorProfile) {
    const id = new URLSearchParams(location.search).get('id');
    const doctor = equipe.find(person => person.categoria === 'medico' && person.id === id);
    if (doctor) {
      document.title = `${doctor.nome} | De Vitis Poliambulatorio`;
      doctorProfile.prepend(personCard(doctor, true, true));
      doctorProfile.querySelector('#doctor-information').textContent =
        doctor.descrizione || `${doctor.specializzazione} presso il Poliambulatorio De Vitis.`;

      if (doctor.prestazioni?.length) {
        const services = element('ul');
        services.append(...doctor.prestazioni.map(service => element('li', '', service)));
        doctorProfile.querySelector('#doctor-services').replaceWith(services);
      }
      doctorProfile.querySelector('form').addEventListener('submit', event => event.preventDefault());
      doctorProfile.hidden = false;
      document.querySelector('#doctor-profile-unavailable').hidden = true;
    }
  }
}


/* NEWSLETTER POLIAMBULATORIO DE VITIS */

(() => {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  const emailInput = document.getElementById("newsletter-email");
  const consentInput = document.getElementById("newsletterConsent");
  const message = document.getElementById("newsletterMessage");
  const button = form.querySelector('button[type="submit"]');
  if (!emailInput || !consentInput || !message || !button) return;

  let submitting = false;

  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxqGK99Ns9e2EjOwh5d7qVnQplO9iL9NSz9K1AFBmY2zsu3UF-p9ajbPROoWFRXvx4l-Q/exec";

  function showMessage(text, type = "") {
    message.textContent = text;
    message.style.color =
      type === "success" ? "#496b22" :
      type === "error" ? "#9b2c2c" : "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    const email = emailInput.value.trim().toLowerCase();

    if (!emailInput.checkValidity()) {
      showMessage("Inserisci un indirizzo email valido.", "error");
      emailInput.reportValidity();
      return;
    }

    if (!consentInput.checked) {
      showMessage(
        "Per iscriverti è necessario prestare il consenso.",
        "error"
      );
      consentInput.focus();
      return;
    }

    const originalText = button.textContent;

    submitting = true;
    button.disabled = true;
    emailInput.disabled = true;
    consentInput.disabled = true;
    button.textContent = "INVIO IN CORSO...";
    showMessage("");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          email: email,
          consent: true
        })
      });

      showMessage(
        "Richiesta inviata. Se ricevi l'email di conferma, " +
        "aprila e clicca su “Conferma iscrizione” " +
        "per completare la procedura.",
        "success"
      );

      form.reset();

    } catch (error) {
      console.error("Errore newsletter:", error);

      showMessage(
        "Non è stato possibile inviare la richiesta. Riprova.",
        "error"
      );

    } finally {
      submitting = false;
      button.disabled = false;
      emailInput.disabled = false;
      consentInput.disabled = false;
      button.textContent = originalText;
    }
  });
})();
