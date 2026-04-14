const CONFIG = {
    ADMIN_EMAIL: "coralieludwig@outlook.fr",
    AIRBNB_LINKS: {
        rocamadour: "https://www.airbnb.fr/wishlists/invite/608f9688-9c16-48c2-9b1b-6f8586718153?viralityEntryPoint=8&s=76",
        salagou: "https://www.airbnb.fr/wishlists/invite/abca9b48-7946-4378-8de0-a70e482e307c?viralityEntryPoint=8&s=76",
        mediterranee: "https://www.airbnb.fr/wishlists/invite/22cc0be1-588f-4e86-b230-fba707ae8d1a?viralityEntryPoint=8&s=76"
    },
    PROGRAMS: {
        rocamadour: [
            "Visite de Rocamadour",
            "Gouffre de Padirac",
            "Arrêt à Saint-Cirq-Lapopie sur la route",
            "Visite de la Grotte des Merveilles"
        ],
        salagou: [
            "Randonnée autour du lac",
            "Randonnée au cirque de Mourèze",
            "Détour par la plage"
        ]
    },
    REQUIRED_PROGRAMS: {
        rocamadour: [
            "Visite de Rocamadour",
            "Gouffre de Padirac"
        ],
        salagou: [
            "Randonnée autour du lac"
        ]
    },
    OFFER_DATA: {
        tetatet: {
            label: "Séjour en tête-à-tête",
            dates: ["15-17 mai", "12-14 juin", "26-28 juin"],
            destinations: [
                { id: "rocamadour", label: "Rocamadour", image: "assets/destinations/rocamadour.jpg" },
                { id: "salagou", label: "Lac du Salagou", image: "assets/destinations/lac-du-salagou.jpg" }
            ],
            programs: {
                rocamadour: [
                    "Visite de Rocamadour",
                    "Gouffre de Padirac",
                    "Arrêt à Saint-Cirq-Lapopie sur la route",
                    "Visite de la Grotte des Merveilles"
                ],
                salagou: [
                    "Randonnée autour du lac",
                    "Randonnée au cirque de Mourèze",
                    "Détour par la plage"
                ]
            },
            requiredPrograms: {
                rocamadour: ["Visite de Rocamadour", "Gouffre de Padirac"],
                salagou: ["Randonnée autour du lac"]
            }
        },
        zelia: {
            label: "Séjour avec Zélia",
            dates: [
                "3-5 juillet",
                "2-3 jours sur la semaine du 13 juillet",
                "2-3 jours sur la semaine du 10 août"
            ],
            destinations: [
                { id: "mediterranee", label: "Mer Méditerrannée", image: "assets/destinations/mediterranee.jpg" }
            ],
            programs: {
                mediterranee: [
                    "Plage",
                    "Fête foraine",
                    "Ballade en vélo",
                    "Manger une glace au bord de l'eau",
                    "Padel avec ton ami Rémi (l'appât)"
                ]
            },
            requiredPrograms: {
                mediterranee: []
            },
            removablePrograms: {
                mediterranee: ["Padel avec ton ami Rémi (l'appât)"]
            }
        }
    },
    STORAGE_KEY: "weekend_bookings"
};

const state = {
    selectedOffers: [],
    selectedDates: [],
    selectedDestination: "",
    programItems: [],
    requiredProgramItems: [],
    removableProgramItems: [],
    accommodationNote: "",
    offerLocked: false,
    lastSavedBookingId: null,
    currentOffer: null
};

const seededBooking = {
    type: "Séjour déjà réservé",
    dates: ["6-12 août"],
    destination: "Les 2 Alpes",
    program: [
        "Vélo de descente",
        "Kayak",
        "Randonnée",
        "Restaurant semi-gastronomique"
    ],
    accommodation: "À confirmer"
};

document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    setupOffers();
    setupFlow();
    setupBookingsActions();
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
            navigateTo(viewName);
        });
    });

    const btnHomeOffers = document.getElementById("btn-home-offers");
    if (btnHomeOffers) {
        btnHomeOffers.addEventListener("click", () => navigateTo("offers"));
    }

    const btnHomeBookings = document.getElementById("btn-home-bookings");
    if (btnHomeBookings) {
        btnHomeBookings.addEventListener("click", () => navigateTo("bookings"));
    }
}

function navigateTo(viewName, options = {}) {
    switchView(viewName, options);
    closeMobileMenu();
}

function switchView(viewName, options = {}) {
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

    if (targetView) {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
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

            if (state.offerLocked && !state.selectedOffers.includes(offerKey)) {
                alert("Ton choix de séjour est verrouillé. Enregistre ce voyage ou recommence à zéro.");
                return;
            }

            state.selectedOffers = [offerKey];
            state.currentOffer = offerKey;
            state.offerLocked = true;

            renderDatesForCurrentOffer();
            renderDestinationsForCurrentOffer();

            document.querySelectorAll(".choice-card").forEach((card) => {
                card.classList.remove("selected", "locked");
            });

            button.classList.add("selected");
            document.querySelectorAll(".choice-card").forEach((card) => {
                if (!card.classList.contains("selected")) {
                    card.classList.add("locked");
                }
            });

            if (state.selectedOffers.length > 0) {
                revealStep("flow-dates");
            }
        });
    });
}

function setupFlow() {
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

    const destinationStack = document.getElementById("destination-stack");
    if (destinationStack) {
        destinationStack.addEventListener("click", (event) => {
            const button = event.target.closest(".destination-row");
            if (!button) {
                return;
            }
            const destination = button.dataset.destination;
            if (!destination || !state.currentOffer) {
                return;
            }
            const offerConfig = CONFIG.OFFER_DATA[state.currentOffer];
            state.selectedDestination = destination;
            state.programItems = [...(offerConfig.programs[destination] || [])];
            state.requiredProgramItems = [...(offerConfig.requiredPrograms[destination] || [])];
            const explicitRemovable = offerConfig.removablePrograms ? offerConfig.removablePrograms[destination] : null;
            if (explicitRemovable) {
                state.removableProgramItems = [...explicitRemovable];
            } else {
                state.removableProgramItems = state.programItems.filter((item) => !state.requiredProgramItems.includes(item));
            }
            renderProgram();
            revealStep("flow-program");
        });
    }

    const btnAddProgram = document.getElementById("btn-add-program");
    if (btnAddProgram) {
        btnAddProgram.addEventListener("click", () => {
            const input = document.getElementById("new-program-item");
            const text = input ? input.value.trim() : "";
            if (!text) {
                return;
            }
            state.programItems.push(text);
            if (!state.removableProgramItems.includes(text)) {
                state.removableProgramItems.push(text);
            }
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

function setupBookingsActions() {
    const submitButton = document.getElementById("btn-submit-bookings");
    if (submitButton) {
        submitButton.addEventListener("click", submitBookingsToAdministrator);
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
        const isRequired = state.requiredProgramItems.includes(item);
        const canRemove = state.removableProgramItems.includes(item) && !isRequired;
        const li = document.createElement("li");
        if (isRequired) {
            li.classList.add("required-item");
        }

        const label = document.createElement("span");
        label.textContent = item;
        li.appendChild(label);

        if (isRequired) {
            const requiredBadge = document.createElement("span");
            requiredBadge.className = "item-required";
            requiredBadge.textContent = "Obligatoire";
            li.appendChild(requiredBadge);
        }

        if (canRemove) {
            const removeBtn = document.createElement("button");
            removeBtn.className = "item-remove";
            removeBtn.type = "button";
            removeBtn.textContent = "Supprimer";
            removeBtn.addEventListener("click", () => {
                if (state.requiredProgramItems.includes(item)) {
                    return;
                }
                state.programItems.splice(index, 1);
                state.removableProgramItems = state.removableProgramItems.filter((entry) => entry !== item);
                renderProgram();
            });
            li.appendChild(removeBtn);
        }

        list.appendChild(li);
    });
}

function updateAccommodationLink() {
    const link = document.getElementById("accommodation-link");
    if (!link) {
        return;
    }

    link.href = CONFIG.AIRBNB_LINKS[state.selectedDestination] || "#";
    link.classList.remove("disabled");
    link.textContent = "Ouvrir la sélection Airbnb";
}

function renderSummary() {
    const summary = document.getElementById("summary-content");
    if (!summary) {
        return;
    }

    const offersText = state.selectedOffers
        .map((offer) => CONFIG.OFFER_DATA[offer]?.label || offer)
        .join(" + ");
    const destinationText = getDestinationLabel(state.currentOffer, state.selectedDestination);

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
    const bookingId = createBookingId();

    const destinationText = getDestinationLabel(state.currentOffer, state.selectedDestination);
    const typeText = state.selectedOffers
        .map((offer) => CONFIG.OFFER_DATA[offer]?.label || offer)
        .join(" + ");

    bookings.push({
        id: bookingId,
        type: typeText,
        dates: state.selectedDates,
        destination: destinationText,
        program: state.programItems,
        accommodation: state.accommodationNote || "Aucune remarque"
    });

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(bookings));
    state.lastSavedBookingId = bookingId;
    resetCurrentJourney();
    navigateTo("bookings");
}

function createBookingId() {
    return `booking-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function resetCurrentJourney() {
    state.selectedOffers = [];
    state.selectedDates = [];
    state.selectedDestination = "";
    state.programItems = [];
    state.requiredProgramItems = [];
    state.removableProgramItems = [];
    state.accommodationNote = "";
    state.offerLocked = false;
    state.currentOffer = null;

    document.querySelectorAll(".choice-card").forEach((card) => {
        card.classList.remove("selected", "locked");
    });

    document.querySelectorAll('input[name="date-option"]').forEach((input) => {
        input.checked = false;
    });

    const noteInput = document.getElementById("accommodation-note");
    if (noteInput) {
        noteInput.value = "";
    }

    ["flow-dates", "flow-destination", "flow-program", "flow-accommodation", "flow-summary"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add("hidden");
        }
    });
}

function renderDatesForCurrentOffer() {
    const dateList = document.getElementById("date-list");
    const offerConfig = CONFIG.OFFER_DATA[state.currentOffer];
    if (!dateList || !offerConfig) {
        return;
    }

    dateList.innerHTML = "";
    offerConfig.dates.forEach((dateValue) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "date-option";
        input.value = dateValue;

        const span = document.createElement("span");
        span.className = state.currentOffer === "tetatet" ? "date-value compact" : "date-value";
        span.textContent = dateValue;

        label.appendChild(input);
        label.appendChild(document.createTextNode(" "));
        label.appendChild(span);
        dateList.appendChild(label);
    });
}

function renderDestinationsForCurrentOffer() {
    const destinationStack = document.getElementById("destination-stack");
    const offerConfig = CONFIG.OFFER_DATA[state.currentOffer];
    if (!destinationStack || !offerConfig) {
        return;
    }

    destinationStack.innerHTML = "";
    offerConfig.destinations.forEach((destination) => {
        const button = document.createElement("button");
        button.className = "destination-row";
        button.type = "button";
        button.dataset.destination = destination.id;
        button.style.backgroundImage = `url('${destination.image}')`;
        button.innerHTML = `
            <span>${destination.label}</span>
        `;
        destinationStack.appendChild(button);
    });
}

function getDestinationLabel(offerKey, destinationId) {
    const offerConfig = CONFIG.OFFER_DATA[offerKey];
    if (!offerConfig) {
        return destinationId;
    }
    const found = offerConfig.destinations.find((item) => item.id === destinationId);
    return found ? found.label : destinationId;
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

    bookings.forEach((booking, index) => {
        const card = document.createElement("article");
        card.className = "booking-card";
        card.dataset.bookingId = booking.id || "";
        const canDelete = !isProtectedBooking(booking);
        card.innerHTML = `
            <h3>${booking.destination}</h3>
            <p class="booking-meta">${booking.dates.join(", ")} • ${booking.type}</p>
            <p><strong>Programme:</strong> ${booking.program.join(" | ")}</p>
            <p><strong>Logement:</strong> ${booking.accommodation}</p>
        `;

        if (canDelete) {
            const actions = document.createElement("div");
            actions.className = "booking-actions";

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn btn-delete";
            deleteBtn.textContent = "Supprimer";
            deleteBtn.addEventListener("click", () => {
                deleteBooking(index);
            });

            actions.appendChild(deleteBtn);
            card.appendChild(actions);
        }

        if (state.lastSavedBookingId && booking.id === state.lastSavedBookingId) {
            card.classList.add("booking-card-focus");
        }

        wrap.appendChild(card);
    });

    state.lastSavedBookingId = null;
}

function submitBookingsToAdministrator() {
    const bookings = getBookings();
    if (bookings.length === 0) {
        alert("Aucune réservation à envoyer pour le moment.");
        return;
    }

    const subject = "Récapitulatif des réservations Escapades";
    const body = buildBookingsEmailBody(bookings);
    window.location.href = `mailto:${CONFIG.ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildBookingsEmailBody(bookings) {
    const intro = [
        "Bonjour,",
        "",
        "Voici le récapitulatif des réservations :",
        ""
    ];

    const details = bookings.map((booking, index) => {
        return [
            `${index + 1}. ${booking.destination}`,
            `Type : ${booking.type}`,
            `Dates : ${booking.dates.join(", ")}`,
            `Programme : ${booking.program.join(" | ")}`,
            `Logement : ${booking.accommodation}`,
            ""
        ].join("\n");
    });

    return [...intro, ...details, "Merci."].join("\n");
}

function isProtectedBooking(booking) {
    return booking.destination === "Les 2 Alpes" && booking.dates.join(",") === "6-12 août";
}

function deleteBooking(index) {
    const bookings = getBookings();
    const booking = bookings[index];
    if (!booking || isProtectedBooking(booking)) {
        return;
    }

    bookings.splice(index, 1);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(bookings));
    renderBookings();
}
