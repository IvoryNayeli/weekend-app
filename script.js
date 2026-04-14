const CONFIG = {
    AIRBNB_LINKS: {
        rocamadour: "https://www.airbnb.fr/wishlists/invite/608f9688-9c16-48c2-9b1b-6f8586718153?viralityEntryPoint=8&s=76",
        salagou: "https://www.airbnb.fr/wishlists/invite/abca9b48-7946-4378-8de0-a70e482e307c?viralityEntryPoint=8&s=76"
    },
    PROGRAMS: {
        rocamadour: [
            "Visite de Rocamadour",
            "Gouffre de Padirac",
            "Arrêt à Saint-Cirq-Lapopie",
            "Grotte des Merveilles"
        ],
        salagou: [
            "Randonnée autour du lac",
            "Cirque de Moureze",
            "Pause plage"
        ]
    },
    STORAGE_KEY: "weekend_bookings"
};

const state = {
    selectedOffers: [],
    selectedDates: [],
    selectedDestination: "",
    programItems: [],
    accommodationNote: ""
};

const seededBooking = {
    type: "Sejour deja reserve",
    dates: ["6-12 aout"],
    destination: "Les 2 Alpes",
    program: [
        "Velo de descente",
        "Kayak",
        "Randonnee",
        "Restaurant semi-gastronomique"
    ],
    accommodation: "A confirmer"
};

document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    setupOffers();
    setupFlow();
    ensureSeedBooking();
    renderBookings();
});

function setupMenu() {
    const menuToggle = document.getElementById("btn-menu-toggle");
    const menuOverlay = document.getElementById("menu-overlay");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            const willOpen = !document.body.classList.contains("menu-open");
            document.body.classList.toggle("menu-open", willOpen);
            menuToggle.setAttribute("aria-expanded", String(willOpen));
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", closeMobileMenu);
    }

    document.querySelectorAll(".shortcut-link, .menu-link").forEach((button) => {
        button.addEventListener("click", () => {
            const viewName = button.dataset.view;
            if (!viewName) {
                return;
            }
            switchView(viewName);
            closeMobileMenu();
        });
    });

    const btnHomeOffers = document.getElementById("btn-home-offers");
    if (btnHomeOffers) {
        btnHomeOffers.addEventListener("click", () => switchView("offers"));
    }
}

function switchView(viewName) {
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    document.querySelectorAll(".menu-link").forEach((btn) => btn.classList.remove("active"));

    const targetView = document.getElementById(`view-${viewName}`);
    const targetBtn = document.querySelector(`.menu-link[data-view="${viewName}"]`);

    if (targetView) {
        targetView.classList.add("active");
    }
    if (targetBtn) {
        targetBtn.classList.add("active");
    }

    if (viewName === "bookings") {
        renderBookings();
    }
}

function closeMobileMenu() {
    document.body.classList.remove("menu-open");
    const menuToggle = document.getElementById("btn-menu-toggle");
    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
    }
}

function setupOffers() {
    document.querySelectorAll(".choice-card").forEach((button) => {
        button.addEventListener("click", () => {
            const offerKey = button.dataset.offer;
            if (!offerKey) {
                return;
            }

            if (state.selectedOffers.includes(offerKey)) {
                state.selectedOffers = state.selectedOffers.filter((item) => item !== offerKey);
                button.classList.remove("selected");
            } else {
                state.selectedOffers.push(offerKey);
                button.classList.add("selected");
            }
        });
    });
}

function setupFlow() {
    const btnToDates = document.getElementById("btn-to-dates");
    if (btnToDates) {
        btnToDates.addEventListener("click", () => {
            if (state.selectedOffers.length === 0) {
                alert("Choisis au moins un type de sejour.");
                return;
            }
            revealStep("flow-dates");
        });
    }

    const btnValidateDates = document.getElementById("btn-validate-dates");
    if (btnValidateDates) {
        btnValidateDates.addEventListener("click", () => {
            state.selectedDates = Array.from(document.querySelectorAll('input[name="date-option"]:checked')).map((input) => input.value);
            if (state.selectedDates.length === 0) {
                alert("Choisis au moins une date.");
                return;
            }
            revealStep("flow-destination");
        });
    }

    document.querySelectorAll(".destination-row").forEach((button) => {
        button.addEventListener("click", () => {
            const destination = button.dataset.destination;
            if (!destination) {
                return;
            }
            state.selectedDestination = destination;
            state.programItems = [...CONFIG.PROGRAMS[destination]];
            renderProgram();
            revealStep("flow-program");
        });
    });

    const btnAddProgram = document.getElementById("btn-add-program");
    if (btnAddProgram) {
        btnAddProgram.addEventListener("click", () => {
            const input = document.getElementById("new-program-item");
            const text = input ? input.value.trim() : "";
            if (!text) {
                return;
            }
            state.programItems.push(text);
            input.value = "";
            renderProgram();
        });
    }

    const btnValidateProgram = document.getElementById("btn-validate-program");
    if (btnValidateProgram) {
        btnValidateProgram.addEventListener("click", () => {
            if (state.programItems.length === 0) {
                alert("Ajoute au moins une activite au programme.");
                return;
            }
            updateAccommodationLink();
            revealStep("flow-accommodation");
        });
    }

    const btnValidateAccommodation = document.getElementById("btn-validate-accommodation");
    if (btnValidateAccommodation) {
        btnValidateAccommodation.addEventListener("click", () => {
            const noteInput = document.getElementById("accommodation-note");
            state.accommodationNote = noteInput ? noteInput.value.trim() : "";
            renderSummary();
            revealStep("flow-summary");
        });
    }

    const btnSaveBooking = document.getElementById("btn-save-booking");
    if (btnSaveBooking) {
        btnSaveBooking.addEventListener("click", saveCurrentBooking);
    }
}

function revealStep(stepId) {
    const el = document.getElementById(stepId);
    if (el) {
        el.classList.remove("hidden");
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function renderProgram() {
    const list = document.getElementById("program-list");
    if (!list) {
        return;
    }

    list.innerHTML = "";
    state.programItems.forEach((item, index) => {
        const li = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = item;

        const removeBtn = document.createElement("button");
        removeBtn.className = "item-remove";
        removeBtn.type = "button";
        removeBtn.textContent = "Supprimer";
        removeBtn.addEventListener("click", () => {
            state.programItems.splice(index, 1);
            renderProgram();
        });

        li.appendChild(label);
        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

function updateAccommodationLink() {
    const link = document.getElementById("accommodation-link");
    if (!link) {
        return;
    }

    link.href = CONFIG.AIRBNB_LINKS[state.selectedDestination] || "#";
}

function renderSummary() {
    const summary = document.getElementById("summary-content");
    if (!summary) {
        return;
    }

    const offersText = state.selectedOffers
        .map((offer) => (offer === "tetatet" ? "Sejours en tete-a-tete" : "Sejours avec Zelia"))
        .join(" + ");
    const destinationText = state.selectedDestination === "rocamadour" ? "Rocamadour" : "Lac du Salagou";

    summary.innerHTML = `
        <p><strong>Type:</strong> ${offersText}</p>
        <p><strong>Dates:</strong> ${state.selectedDates.join(", ")}</p>
        <p><strong>Destination:</strong> ${destinationText}</p>
        <p><strong>Programme:</strong> ${state.programItems.join(" | ")}</p>
        <p><strong>Remarque logement:</strong> ${state.accommodationNote || "Aucune"}</p>
    `;
}

function saveCurrentBooking() {
    const bookings = getBookings();

    const destinationText = state.selectedDestination === "rocamadour" ? "Rocamadour" : "Lac du Salagou";
    const typeText = state.selectedOffers
        .map((offer) => (offer === "tetatet" ? "Sejours en tete-a-tete" : "Sejours avec Zelia"))
        .join(" + ");

    bookings.push({
        type: typeText,
        dates: state.selectedDates,
        destination: destinationText,
        program: state.programItems,
        accommodation: state.accommodationNote || "Aucune remarque"
    });

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(bookings));
    renderBookings();
    switchView("bookings");
}

function ensureSeedBooking() {
    const bookings = getBookings();
    const hasSeed = bookings.some((booking) => booking.destination === seededBooking.destination && booking.dates.join(",") === seededBooking.dates.join(","));

    if (!hasSeed) {
        bookings.unshift(seededBooking);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(bookings));
    }
}

function getBookings() {
    try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

function renderBookings() {
    const wrap = document.getElementById("bookings-list");
    if (!wrap) {
        return;
    }

    const bookings = getBookings();
    wrap.innerHTML = "";

    bookings.forEach((booking) => {
        const card = document.createElement("article");
        card.className = "booking-card";
        card.innerHTML = `
            <h3>${booking.destination}</h3>
            <p class="booking-meta">${booking.dates.join(", ")} • ${booking.type}</p>
            <p><strong>Programme:</strong> ${booking.program.join(" | ")}</p>
            <p><strong>Logement:</strong> ${booking.accommodation}</p>
        `;
        wrap.appendChild(card);
    });
}
