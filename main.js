
// animation scrool for texts
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
ScrollReveal().reveal(".header_container p", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".header_container h1", {
  ...scrollRevealOption,
  delay: 500,
});

// about container
ScrollReveal().reveal(".about-image img", {
  ...scrollRevealOption,
  origin: "left",
});

ScrollReveal().reveal(".about__content .section-subheader", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".about__content .section-header", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".about__btn", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".section-container.gallery-page h2", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".gallery-grid", {
  ...scrollRevealOption,
  delay: 500,
});
// finishe animation

// --------------------------------------------
// FORMATA datas  →  sempre retorna DD/MM/YYYY
// Aceita: "2025-12-16" OU Date()
// --------------------------------------------
function formatDate(dateInput) {
  if (!dateInput) return "";

  // Se já é um objeto Date
  if (dateInput instanceof Date) {
    const d = String(dateInput.getDate()).padStart(2, "0");
    const m = String(dateInput.getMonth() + 1).padStart(2, "0");
    const y = dateInput.getFullYear();
    return `${d}/${m}/${y}`;
  }

  // Se é string "YYYY-MM-DD"
  if (typeof dateInput === "string" && dateInput.includes("-")) {
    const [y, m, d] = dateInput.split("-");
    return `${d}/${m}/${y}`;
  }

  // Se for string já formatada "DD/MM/YYYY"
  if (typeof dateInput === "string" && dateInput.includes("/")) {
    return dateInput;
  }

  return "";
}

// Converte DD/MM/YYYY → YYYY-MM-DD
function revertDateFormat(dmy) {
  const [day, month, year] = dmy.split("/");
  return `${year}-${month}-${day}`;
}

// BOOKING

// -------------------------------------------------------
// CARREGAR PARÂMETROS DA URL (CHECKIN / CHECKOUT / GUEST)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);

  window.checkin = params.get("checkin");
  window.checkout = params.get("checkout");
  window.guest = params.get("guest");

  // Atualiza os campos do resumo (se existirem)
  const elCheckin = document.getElementById("summary-checkin");
  if (elCheckin) elCheckin.textContent = formatDate(checkin);

  const elGuests = document.getElementById("summary-guests");
  if (elGuests) elGuests.textContent = guest;

  const elNights = document.getElementById("summary-nights");
  if (elNights && checkin && checkout) {
    const d1 = new Date(checkin);
    const d2 = new Date(checkout);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    elNights.textContent = diff;
    window.nights = diff; // torna global para extras
  }

  const elRooms = document.getElementById("summary-rooms");
  if (elRooms) elRooms.textContent = guest;

  renderRooms();

  //Já marcar o primeiro passo como ativo (bold)
  updateBreadcrumb("step-rooms");

});

document.addEventListener("DOMContentLoaded", function () {

  // Inicializa flatpickr
  const calendar = flatpickr("#dates", {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    showMonths: 1,
     // FORMATAR o valor exibido NO INPUT
  onClose: function(selectedDates) {
    if (selectedDates.length === 2) {

      const display =
        formatDate(selectedDates[0]) + " to " + formatDate(selectedDates[1]);

      document.getElementById("dates").value = display;
    }
  }
  });

  // Botão SEARCH
  const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  document.getElementById("searchBtn").addEventListener("click", () => {
    
    var dates = document.getElementById("dates").value;
    var guest = document.getElementById("guest").value;

    if (!dates) {
      alert("Please select dates and guest number.");
      return;
    }

    // Extrai check-in e check-out
    var [checkin, checkout] = dates.split(" to ");

    // Monta URL com parâmetros
    const url = `booking.html?checkin=${revertDateFormat(checkin)}&checkout=${revertDateFormat(checkout)}&guest=${guest}`;

    // Redireciona
    window.location.href = url;
  });}

});

// EDIT BOOKING
// ----------------------------------------------------
// FUNÇÃO: abrir o painel quando clicar em Edit Booking
// ----------------------------------------------------
const editBtn = document.querySelector(".edit-btn-container .btn");
if (editBtn) {
  editBtn.addEventListener("click", () => {
     // Exibe o painel alterando display para flex
  document.getElementById("edit-panel").style.display = "flex";

  // Preenche automaticamente as datas atuais da pesquisa
  document.getElementById("edit-dates").value =
      `${checkin} to ${checkout}`;

  // Preenche o número de hóspedes atual
  document.getElementById("edit-guests").value = guest;
  });
}

// --------------------------------------------
// FUNÇÃO: fechar o painel
// --------------------------------------------
// FECHAR O PAINEL — só existe em booking.html
// --------------------------------------------

const closeEditBtn = document.getElementById("close-edit");

if (closeEditBtn) {
  closeEditBtn.addEventListener("click", () => {
    document.getElementById("edit-panel").style.display = "none";
  });
}

// -------------------------------------------------
// FUNÇÃO: processar o formulário e fazer nova busca
// -------------------------------------------------
const submitForm = document.getElementById("edit-form");
if (submitForm) {
document.getElementById("edit-form").addEventListener("submit", (e) => {
  e.preventDefault(); // impede recarregamento automático do formulário

  // Divide o range de datas "checkin to checkout"
  const newDates = document.getElementById("edit-dates").value.split(" to ");
  const newCheckin = newDates[0];
  const newCheckout = newDates[1];

  // Pega o novo número de hóspedes selecionado
  const newGuests = document.getElementById("edit-guests").value;

  // Redireciona para a mesma página com os novos valores
  window.location = `booking.html?checkin=${newCheckin}&checkout=${newCheckout}&guest=${newGuests}`;
});
}

// ---------------------------------------
// ATIVAR FLATPICKR NO PAINEL
// (calendário para escolher novas datas)
// ---------------------------------------
flatpickr("#edit-dates", {
  mode: "range",     // permite selecionar 2 datas (início e fim)
  minDate: "today",  // evita datas antigas
});

//ROOMS

const rooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    price: 180,
    guests: 2,
    beds: "1 King Bed",
    size: "35m²",
    img: "images/rooms/room1.png",
    description: "Spacious room with balcony, city view and premium amenities.",

    // 🔥 DATAS OCUPADAS (2025 → 2026)
    unavailableDates: [
      { start: "2025-12-12", end: "2025-12-15" },
      { start: "2026-01-20", end: "2026-01-23" },

    ]
  },

  {
    id: 2,
    name: "Double Standard Room",
    price: 120,
    guests: 3,
    beds: "2 Double Beds",
    size: "28m²",
    img: "images/rooms/room2.png",
    description: "Comfortable room for families or small groups.",

    // 🔥 DATAS OCUPADAS (2025 → 2026)
    unavailableDates: [
      { start: "2025-12-10", end: "2025-12-15" },
      { start: "2026-01-05", end: "2026-01-09" },
      { start: "2026-02-14", end: "2026-02-18" },
      { start: "2026-03-01", end: "2026-03-04" },
      { start: "2026-04-20", end: "2026-04-25" },
      { start: "2026-06-10", end: "2026-06-18" },
      { start: "2026-09-01", end: "2026-09-05" },
    ]
  },

  {
    id: 3,
    name: "Executive Suite",
    price: 250,
    guests: 4,
    beds: "1 King Bed + Sofa Bed",
    size: "50m²",
    img: "images/rooms/room3.png",
    description: "Luxury suite with lounge area, workspace, and premium service.",

    // 🔥 DATAS OCUPADAS (2025 → 2026) — mais períodos por ser a suíte mais procurada
    unavailableDates: [
      { start: "2025-12-10", end: "2025-12-20" },
      { start: "2026-01-10", end: "2026-01-18" },
      { start: "2026-02-05", end: "2026-02-12" },
      { start: "2026-03-20", end: "2026-03-29" },
      { start: "2026-05-15", end: "2026-05-22" },
      { start: "2026-08-01", end: "2026-08-15" },
      { start: "2026-12-10", end: "2026-12-31" },
    ]
  },

  {
    id: 4,
    name: "Executive Suite +PLUS",
    price: 450,
    guests: 6,
    beds: "2 King Bed + Sofa Bed + 1 single bed",
    size: "80m²",
    img: "images/rooms/room4.jpg",
    description: "Luxury suite PLUS with lounge area, workspace, and premium service.",

    unavailableDates: [
      { start: "2025-12-08", end: "2025-12-17" },
      { start: "2026-03-10", end: "2026-03-15" },
      { start: "2026-05-01", end: "2026-05-03" },
      { start: "2026-07-20", end: "2026-07-28" },
      { start: "2026-10-05", end: "2026-10-12" },
      { start: "2026-08-05", end: "2026-08-12" },
      { start: "2026-12-01", end: "2026-12-31" },
    ]
  }
];

function updateBreadcrumb(step) {
  const rooms = document.getElementById("crumb-rooms");
  const extras = document.getElementById("crumb-extras");
  const details = document.getElementById("crumb-details");

  // Se não existir breadcrumb na página → sai sem erro
  if (!rooms || !extras || !details) return;

  // limpa o bold de todos
  rooms.classList.remove("crumb-active");
  extras.classList.remove("crumb-active");
  details.classList.remove("crumb-active");

  // aplica bold no step atual
  if (step === "step-rooms") rooms.classList.add("crumb-active");
  if (step === "step-extras") extras.classList.add("crumb-active");
  if (step === "step-details") details.classList.add("crumb-active");
}


// step
function goToStep(step) {
  // esconde todos
  document.getElementById("step-rooms").style.display = "none";
  document.getElementById("step-extras").style.display = "none";
  document.getElementById("step-details").style.display = "none";
  document.getElementById("step-complete").style.display = "none";

  // mostra o passo escolhido
  document.getElementById(step).style.display = "block";

    // 🔥 aplica BOLD no breadcrumb
  updateBreadcrumb(step);

    // 🔥 Sempre rola para o topo da seção de booking
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("select-room-btn")) {

    const roomId = e.target.dataset.id;

    // salve a escolha
    sessionStorage.setItem("selectedRoom", roomId);

    // carrega extras
    renderExtras();

    // vai para o próximo passo
    goToStep("step-extras");
    document.querySelector(".steps-summary").style.display = "block";

  }
});

// -----------------------------------------------
// BOTÕES DE VOLTAR ENTRE AS ETAPAS
// Reaproveita a mesma lógica para qualquer "back"
// -----------------------------------------------
document.addEventListener("click", (e) => {

  // Voltar para QUARTOS
  if (e.target.id === "back-rooms") {
    goToStep("step-rooms");
    document.querySelector(".steps-summary").style.display = "none";
  }

  // Voltar para EXTRAS
  if (e.target.id === "back-extras") {
    goToStep("step-extras");
    document.querySelector(".steps-summary").style.display = "block";
  }

})


// ---------------------------------------------
// Carrega o quarto selecionado no painel resumo
// ---------------------------------------------
function loadSelectedRoom() {

  const roomId = sessionStorage.getItem("selectedRoom");
  if (!roomId) return;

  const room = rooms.find(r => r.id == roomId);
  if (!room) return;

  const nights = Math.ceil((new Date(checkin) - new Date(checkout)) / (1000 * 60 * 60 * 24));

  const nightsCalc = Math.ceil(
    (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
  );

  const base = room.price * nightsCalc;

  document.getElementById("sum-room-name").textContent = room.name;

  document.getElementById("sum-room-price").textContent =
    `€${room.price} × ${nightsCalc} nights = €${base}`;

  sessionStorage.setItem("baseTotal", base);

  updateTotal();
}

// ---------------------------------------
// Calcula o total final (noites + extras)
// ---------------------------------------
function updateTotal() {

  const base = Number(sessionStorage.getItem("baseTotal")) || 0;

  let extrasTotal = 0;
  let html = "";

  document.querySelectorAll(".extra-check:checked").forEach(ex => {
    const name = ex.dataset.name;
    const price = Number(ex.dataset.price);

    extrasTotal += price;

    html += `<p>${name}: €${price}</p>`;
  });

  document.getElementById("sum-extras").innerHTML = html;

  document.getElementById("sum-total").textContent = "€" + (base + extrasTotal);
}

// Quando marcar/desmarcar um extra → recalcula total e lista
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("extra-check")) {
    updateTotal();
  }
});

// ---------------------------------------
// Quando o usuário clica em "Select Room"
// ---------------------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("select-room-btn")) {

    // preencher o resumo da etapa de extras

    const roomId = e.target.dataset.id;
    const room = rooms.find(r => r.id == roomId);

    // salvar ID do quarto
    sessionStorage.setItem("selectedRoom", roomId);

    // calcular noites
    const nightsCalc = Math.ceil(
      (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    );
    const base = room.price * nightsCalc;

    // atualizar painel
    document.getElementById("sum-room-name").textContent = room.name;

    document.getElementById("sum-room-price").textContent =
      `€${room.price} × ${nightsCalc} nights = €${base}`;

    // salvar base
    sessionStorage.setItem("baseTotal", base);

    // atualizar total
    updateTotal();

    document.getElementById("sum-checkin").textContent = formatDate(checkin);
    document.getElementById("sum-guests").textContent = guest;
    document.getElementById("sum-nights").textContent = nightsCalc;

    // ir para etapa extras
    goToStep("step-extras");
  }
});


function renderExtras() {

  const extras = [
    { name: "Breakfast", price: 20, img: "images/extras/breakfast.jpeg" },
    { name: "Early Check-in", price: 40, img: "images/extras/early-CI.jpeg" },
    { name: "Late Check-out", price: 35, img: "images/extras/late-CO.jpg" }
  ];

  const container = document.getElementById("extras-container");
  container.innerHTML = "";

  extras.forEach(ex => {
    container.innerHTML += `
      <div class="extra-item">
        <img src="${ex.img}" class="extra-img">

        <div>
          <h3>${ex.name}</h3>
          <p>Price: €${ex.price},00</p>

          <label>
            <input type="checkbox" class="extra-check" data-name="${ex.name}" data-price="${ex.price}">
            Add
          </label>
        </div>
      </div>
    `;
  });
}

// step final to details and booking room
const details = document.getElementById("go-details");
if (details) {
document.getElementById("go-details").addEventListener("click", () => {
    goToStep("step-details");
});
}

// -----------------------------------------------------------
// FUNÇÃO QUE VERIFICA SE O INTERVALO SELECIONADO PELO USUÁRIO
// ENTRA EM CONFLITO COM AS DATAS OCUPADAS DO QUARTO
// -----------------------------------------------------------
function isRoomAvailable(room, checkin, checkout) {

  const userStart = new Date(checkin);
  const userEnd = new Date(checkout);

  // percorre cada intervalo ocupado
  for (let range of room.unavailableDates) {

    const bookedStart = new Date(range.start);
    const bookedEnd = new Date(range.end);

    // Se houver interseção entre as datas => indisponível
    const overlap =
      userStart <= bookedEnd && userEnd >= bookedStart;

    if (overlap) return false;
  }

  return true; // sem conflito
}

/* ============================================================
   FUNÇÃO PARA RENDERIZAR OS QUARTOS NA TELA
   - Percorre o array rooms[]
   - Cria um card HTML para cada quarto
   - Insere tudo dentro do rooms-container
   ============================================================ */
function renderRooms() {
  const container = document.getElementById("rooms-container");

  //  Se não existir container → sai da função
  if (!container) return;

  container.innerHTML = "";

  // Limpa antes de renderizar (caso precise re-renderizar)
  container.innerHTML = "";



  rooms.forEach(room => {
    // Template do card do quarto
    var available = isRoomAvailable(room, checkin, checkout);

const card = `
  <div class="room-card ${available ? "" : "unavailable"}">

    <img src="${room.img}" alt="${room.name}" class="room-img">

    <div class="room-info">
      <h3 class="room-name">${room.name}</h3>

      <!-- Mostra aviso se o quarto estiver indisponível -->
      ${!available ? `
        <div class="room-unavailable-msg">
          <i class="ri-error-warning-line"></i>
          <span>Unavailable for selected dates</span>
        </div>
      ` : ""}

      <p class="room-desc">${room.description}</p>

      <ul class="room-details">
        <li><strong>Beds:</strong> ${room.beds}</li>
        <li><strong>Max Guests:</strong> ${room.guests}</li>
        <li><strong>Size:</strong> ${room.size}</li>
      </ul>

      <div class="room-footer">
        <span class="room-price">€${room.price}/night</span>

        <!-- Se indisponível, desabilita o botão -->
        <button class="btn select-room-btn" data-id="${room.id}" 
          ${!available ? "disabled" : ""}>
          ${available ? "Select Room" : "Unavailable"}
        </button>
      </div>

    </div>

  </div>
`;


    // Insere o card no container
    container.insertAdjacentHTML("beforeend", card);
  });
}

/* ============================================================
   CHAMA A FUNÇÃO PARA RENDERIZAR OS QUARTOS
   ============================================================ */


// ====================================================
// FINISH BOOKING > MOSTRAR LOADING > TELA FINAL > EMAIL
// ====================================================

const detailsForm = document.getElementById("details-form");
if (detailsForm ) {
document.getElementById("details-form").addEventListener("submit", (e) => {
  e.preventDefault(); // <-- impede reload!

   const form = document.getElementById("details-form");
  
  // Gera número de reserva
  const bookingNumber = "BK" + Math.floor(Math.random() * 900000 + 100000);

  // Preenche os campos ocultos
  form.elements["order_id"].value = bookingNumber;
  form.elements["room_name"].value = document.getElementById("sum-room-name").textContent;
  form.elements["room_price"].value = document.getElementById("sum-room-price").textContent;
  form.elements["extras_list"].value = document.getElementById("sum-extras").innerText ? document.getElementById("sum-extras").innerText : '0' ;
  form.elements["total_value"].value = document.getElementById("sum-total").textContent;
  form.elements["checkin_date"].value = formatDate(document.getElementById("summary-checkin").textContent);
  form.elements["checkout_date"].value = formatDate(window.checkout);

  emailjs.init({
  publicKey: "Ut2hO0-i8Q85K2fr2",
  });

    // Mostra o modal de loading com o GIF
  document.getElementById("loading-modal").style.display = "flex";

  emailjs.sendForm("service_jzfmu5a", "template_p3u4sc3", form)
    .then(() => {

        // Aguarda 3 segundos simulando processamento
        setTimeout(() => {
                // Esconde o painel lateral
        document.querySelector(".steps-summary").style.display = "none";
          const grid = document.querySelector(".steps-grid");
  if (grid) grid.style.display = "none"; //remover grid para centralizar
          // Preenche número de reserva na tela final
          document.getElementById("booking-number").textContent = bookingNumber;
        // Some com o loading
          document.getElementById("loading-modal").style.display = "none";
      // Vai para o step final
          goToStep("step-complete");

        }, 3000);

     })
    .catch((error) => {
      console.error(error);

      document.getElementById("loading-modal").style.display = "none";
    });

});
}

// GALLERY

/* ======================================================
   GALLERY: LISTA DE FOTOS (adicione quanto quiser)
   ====================================================== */

const galleryImages = [
  { src: "images/gallery/1.jpg", large: true },
  { src: "images/gallery/2.jpg" },
  { src: "images/gallery/3.jpg" },
  { src: "images/gallery/4.jpg", large: true  },
  { src: "images/gallery/5.jpg" },
  { src: "images/gallery/6.jpg" },
  { src: "images/gallery/7.jpg", large: true },
  { src: "images/gallery/8.png" },
  { src: "images/gallery/9.jpg" },
  { src: "images/gallery/10.png", large: true },
  { src: "images/gallery/11.png" },
  { src: "images/gallery/12.png" },
  { src: "images/gallery/13.jpg", large: true },
  { src: "images/gallery/14.png" },
  { src: "images/gallery/15.jpg" }
];

/* ======================================================
   GALLERY: RENDERIZA AS FOTOS AUTOMATICAMENTE
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return; // ← evita erro ao carregar em outras páginas

  galleryImages.forEach(img => {
    const div = document.createElement("div");
    div.className = "gallery-item" + (img.large ? " large" : "");

    div.innerHTML = `<img src="${img.src}" alt="Hotel Photo">`;

    galleryGrid.appendChild(div);
  });
});




