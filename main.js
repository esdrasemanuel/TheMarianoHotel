// animation scroll for texts
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
// finish animation

// --------------------------------------------
// FORMAT dates → always returns DD/MM/YYYY
// Accepts: "2025-12-16" OR Date()
// --------------------------------------------
function formatDate(dateInput) {
  if (!dateInput) return "";

  // If it is already a Date object
  if (dateInput instanceof Date) {
    const d = String(dateInput.getDate()).padStart(2, "0");
    const m = String(dateInput.getMonth() + 1).padStart(2, "0");
    const y = dateInput.getFullYear();
    return `${d}/${m}/${y}`;
  }

  // If it's a "YYYY-MM-DD" string
  if (typeof dateInput === "string" && dateInput.includes("-")) {
    const [y, m, d] = dateInput.split("-");
    return `${d}/${m}/${y}`;
  }

  // If it's already formatted like "DD/MM/YYYY"
  if (typeof dateInput === "string" && dateInput.includes("/")) {
    return dateInput;
  }

  return "";
}

// Converts DD/MM/YYYY → YYYY-MM-DD
function revertDateFormat(dmy) {
  const [day, month, year] = dmy.split("/");
  return `${year}-${month}-${day}`;
}

// BOOKING

// -------------------------------------------------------
// LOAD URL PARAMETERS (CHECKIN / CHECKOUT / GUEST)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);

  window.checkin = params.get("checkin");
  window.checkout = params.get("checkout");
  window.guest = params.get("guest");

  // Updates the summary fields (if they exist)
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
    window.nights = diff; // makes global for extras
  }

  const elRooms = document.getElementById("summary-rooms");
  if (elRooms) elRooms.textContent = guest;

  renderRooms();

  // Mark the first step as active (bold)
  updateBreadcrumb("step-rooms");

});

document.addEventListener("DOMContentLoaded", function () {

  // Initialize flatpickr
  const calendar = flatpickr("#dates", {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    showMonths: 1,
     // FORMAT the value shown in the input
  onClose: function(selectedDates) {
    if (selectedDates.length === 2) {

      const display =
        formatDate(selectedDates[0]) + " to " + formatDate(selectedDates[1]);

      document.getElementById("dates").value = display;
    }
  }
  });

  // SEARCH button
  const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  document.getElementById("searchBtn").addEventListener("click", () => {
    
    var dates = document.getElementById("dates").value;
    var guest = document.getElementById("guest").value;

    if (!dates) {
      alert("Please select dates and guest number.");
      return;
    }

    // Extract check-in and check-out
    var [checkin, checkout] = dates.split(" to ");

    // Build URL with parameters
    const url = `booking.html?checkin=${revertDateFormat(checkin)}&checkout=${revertDateFormat(checkout)}&guest=${guest}`;

    // Redirect
    window.location.href = url;
  });}

});

// EDIT BOOKING
// ----------------------------------------------------
// FUNCTION: open panel when clicking "Edit Booking"
// ----------------------------------------------------
const editBtn = document.querySelector(".edit-btn-container .btn");
if (editBtn) {
  editBtn.addEventListener("click", () => {
     // Show the panel changing display to flex
  document.getElementById("edit-panel").style.display = "flex";

  // Auto-fill current search dates
  document.getElementById("edit-dates").value =
      `${checkin} to ${checkout}`;

  // Fill current number of guests
  document.getElementById("edit-guests").value = guest;
  });
}

// --------------------------------------------
// FUNCTION: close panel
// --------------------------------------------
// CLOSE PANEL — only exists in booking.html
// --------------------------------------------

const closeEditBtn = document.getElementById("close-edit");

if (closeEditBtn) {
  closeEditBtn.addEventListener("click", () => {
    document.getElementById("edit-panel").style.display = "none";
  });
}

// -------------------------------------------------
// FUNCTION: process the form and perform new search
// -------------------------------------------------
const submitForm = document.getElementById("edit-form");
if (submitForm) {
document.getElementById("edit-form").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents auto reload

  // Splits date range "checkin to checkout"
  const newDates = document.getElementById("edit-dates").value.split(" to ");
  const newCheckin = newDates[0];
  const newCheckout = newDates[1];

  // Gets new selected number of guests
  const newGuests = document.getElementById("edit-guests").value;

  // Redirect with updated values
  window.location = `booking.html?checkin=${newCheckin}&checkout=${newCheckout}&guest=${newGuests}`;
});
}

// ---------------------------------------
// ACTIVATE FLATPICKR IN THE PANEL
// (calendar to select new dates)
// ---------------------------------------
flatpickr("#edit-dates", {
  mode: "range",     // allows selecting start + end date
  minDate: "today",  // avoids past dates
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

    // 🔥 OCCUPIED DATES (2025 → 2026)
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

    // 🔥 OCCUPIED DATES (2025 → 2026)
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

    // 🔥 OCCUPIED DATES (2025 → 2026) — more periods because it's highly requested
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

  // If breadcrumb doesn’t exist → exit without error
  if (!rooms || !extras || !details) return;

  // Remove bold from all
  rooms.classList.remove("crumb-active");
  extras.classList.remove("crumb-active");
  details.classList.remove("crumb-active");

  // Apply bold to the current step
  if (step === "step-rooms") rooms.classList.add("crumb-active");
  if (step === "step-extras") extras.classList.add("crumb-active");
  if (step === "step-details") details.classList.add("crumb-active");
}


// step
function goToStep(step) {
  // hide all
  document.getElementById("step-rooms").style.display = "none";
  document.getElementById("step-extras").style.display = "none";
  document.getElementById("step-details").style.display = "none";
  document.getElementById("step-complete").style.display = "none";

  // show selected step
  document.getElementById(step).style.display = "block";

    // 🔥 apply BOLD to breadcrumb
  updateBreadcrumb(step);

    // 🔥 Always scroll to top of booking section
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("select-room-btn")) {

    const roomId = e.target.dataset.id;

    // save selection
    sessionStorage.setItem("selectedRoom", roomId);

    // load extras
    renderExtras();

    // go to next step
    goToStep("step-extras");
    document.querySelector(".steps-summary").style.display = "block";

  }
});

// -----------------------------------------------
// BACK BUTTONS BETWEEN STEPS
// Reuses same logic for any "back"
// -----------------------------------------------
document.addEventListener("click", (e) => {

  // Back to ROOMS
  if (e.target.id === "back-rooms") {
    goToStep("step-rooms");
    document.querySelector(".steps-summary").style.display = "none";
  }

  // Back to EXTRAS
  if (e.target.id === "back-extras") {
    goToStep("step-extras");
    document.querySelector(".steps-summary").style.display = "block";
  }

})


// ---------------------------------------------
// Loads selected room into summary panel
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
// Calculates final total (nights + extras)
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

// When checking/unchecking an extra → recalculate total and extras list
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("extra-check")) {
    updateTotal();
  }
});

// ---------------------------------------
// When user clicks "Select Room"
// ---------------------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("select-room-btn")) {

    // fill summary for extras step

    const roomId = e.target.dataset.id;
    const room = rooms.find(r => r.id == roomId);

    // save room ID
    sessionStorage.setItem("selectedRoom", roomId);

    // calculate nights
    const nightsCalc = Math.ceil(
      (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    );
    const base = room.price * nightsCalc;

    // update panel
    document.getElementById("sum-room-name").textContent = room.name;

    document.getElementById("sum-room-price").textContent =
      `€${room.price} × ${nightsCalc} nights = €${base}`;

    // save base
    sessionStorage.setItem("baseTotal", base);

    // update total
    updateTotal();

    document.getElementById("sum-checkin").textContent = formatDate(checkin);
    document.getElementById("sum-guests").textContent = guest;
    document.getElementById("sum-nights").textContent = nightsCalc;

    // go to extras step
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
// FUNCTION THAT CHECKS IF SELECTED DATE RANGE
// CONFLICTS WITH ROOM'S OCCUPIED DATES
// -----------------------------------------------------------
function isRoomAvailable(room, checkin, checkout) {

  const userStart = new Date(checkin);
  const userEnd = new Date(checkout);

  // loop through each occupied interval
  for (let range of room.unavailableDates) {

    const bookedStart = new Date(range.start);
    const bookedEnd = new Date(range.end);

    // If there is intersection in dates => unavailable
    const overlap =
      userStart <= bookedEnd && userEnd >= bookedStart;

    if (overlap) return false;
  }

  return true; // no conflict
}

/* ============================================================
   FUNCTION TO RENDER ROOMS ON SCREEN
   - Loops through rooms[]
   - Builds HTML cards
   - Inserts into rooms-container
   ============================================================ */
function renderRooms() {
  const container = document.getElementById("rooms-container");

  // If container does not exist → exit
  if (!container) return;

  container.innerHTML = "";

  // Clear before rendering again
  container.innerHTML = "";

  rooms.forEach(room => {
    // Room card template
    var available = isRoomAvailable(room, checkin, checkout);

const card = `
  <div class="room-card ${available ? "" : "unavailable"}">

    <img src="${room.img}" alt="${room.name}" class="room-img">

    <div class="room-info">
      <h3 class="room-name">${room.name}</h3>

      <!-- Shows warning if room is unavailable -->
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

        <!-- If unavailable, disable button -->
        <button class="btn select-room-btn" data-id="${room.id}" 
          ${!available ? "disabled" : ""}>
          ${available ? "Select Room" : "Unavailable"}
        </button>
      </div>

    </div>

  </div>
`;


    // Insert card into container
    container.insertAdjacentHTML("beforeend", card);
  });
}

/* ============================================================
   CALL FUNCTION TO RENDER ROOMS
   ============================================================ */


// ====================================================
// FINISH BOOKING > SHOW LOADING > FINAL SCREEN > EMAIL
// ====================================================

const detailsForm = document.getElementById("details-form");
if (detailsForm ) {
document.getElementById("details-form").addEventListener("submit", (e) => {
  e.preventDefault(); // prevents reload!

   const form = document.getElementById("details-form");
  
  // Generate booking number
  const bookingNumber = "BK" + Math.floor(Math.random() * 900000 + 100000);

  // Fill hidden fields
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

    // Show loading modal with GIF
  document.getElementById("loading-modal").style.display = "flex";

  emailjs.sendForm("service_jzfmu5a", "template_p3u4sc3", form)
    .then(() => {

        // Wait 3 seconds simulating processing
        setTimeout(() => {
                // Hide sidebar
        document.querySelector(".steps-summary").style.display = "none";
          const grid = document.querySelector(".steps-grid");
  if (grid) grid.style.display = "none"; //remove grid to center

          // Insert booking number on final screen
          document.getElementById("booking-number").textContent = bookingNumber;

        // Remove loading modal
          document.getElementById("loading-modal").style.display = "none";

      // Go to final step
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
   GALLERY: PHOTO LIST (add as many as you want)
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
   GALLERY: AUTO-RENDERS PHOTOS
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return; // avoids errors on other pages

  galleryImages.forEach(img => {
    const div = document.createElement("div");
    div.className = "gallery-item" + (img.large ? " large" : "");

    div.innerHTML = `<img src="${img.src}" alt="Hotel Photo">`;

    galleryGrid.appendChild(div);
  });
});
