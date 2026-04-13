// ===== CONFIG =====
const CONFIG = {
    // Email pour FormSubmit (à modifier)
    EMAIL: "your-email@example.com",
    
    // Messages personnalisés
    REFUSAL_MESSAGES: [
        "Je comprends, ce n'est pas grave ! 😊",
        "Pas de problème, on trouvera une autre occasion !",
        "Pas de souci, bisous ! 💙"
    ],
    
    // Programmes selon destination
    PROGRAMS: {
        "rocamadour": [
            "🏰 Visite de Rocamadour",
            "🕳️ Gouffre de Padirac",
            "🏘️ Arrêt à Saint-Cirq-Lapopie en chemin",
            "🎨 Grotte des Merveilles"
        ],
        "salagou": [
            "🥾 Randonnée autour du lac (incontournable)",
            "🏔️ Cirque de Mourèze",
            "🏖️ Arrêt plage sur la route"
        ]
    },
    
    // Liens Airbnb
    AIRBNB_LINKS: {
        "rocamadour": "https://www.airbnb.fr/wishlists/invite/608f9688-9c16-48c2-9b1b-6f8586718153?viralityEntryPoint=8&s=76",
        "salagou": "https://www.airbnb.fr/wishlists/invite/abca9b48-7946-4378-8de0-a70e482e307c?viralityEntryPoint=8&s=76"
    }
};

// ===== STATE =====
let state = {
    dates: [],
    customDates: "",
    destinations: [],
    customDestination: "",
    accommodationFeedback: "",
    budget: 0,
    accommodationChosen: false
};

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Screen 1: Introduction
    document.getElementById('btn-see-proposals').addEventListener('click', () => {
        showScreen('screen-dates');
    });

    document.getElementById('btn-refuse-intro').addEventListener('click', refuseIntro);

    // Screen 2: Dates
    document.getElementById('date-custom').addEventListener('change', (e) => {
        toggleElement('custom-dates-input', e.target.checked);
    });

    document.getElementById('btn-back-dates').addEventListener('click', () => {
        resetDatesScreen();
        showScreen('screen-intro');
    });

    document.getElementById('btn-validate-dates').addEventListener('click', validateDates);

    // Screen 3: Destination
    document.getElementById('destination-custom').addEventListener('change', (e) => {
        toggleElement('custom-destination-input', e.target.checked);
    });

    document.getElementById('btn-back-destination').addEventListener('click', () => {
        resetDestinationScreen();
        showScreen('screen-dates');
    });

    document.getElementById('btn-validate-destination').addEventListener('click', validateDestination);

    // Screen 4: Accommodation
    document.getElementById('btn-back-accommodation').addEventListener('click', () => {
        showScreen('screen-destination');
    });

    document.getElementById('btn-accommodation-perfect').addEventListener('click', () => {
        state.accommodationChosen = true;
        showSummary();
    });

    document.getElementById('btn-accommodation-issue').addEventListener('click', () => {
        toggleElement('accommodation-feedback', true);
    });

    document.getElementById('btn-update-budget').addEventListener('click', () => {
        const budgetInput = document.getElementById('budget-input');
        if (budgetInput.value) {
            state.budget = parseInt(budgetInput.value);
            updateBudgetDisplay();
        }
    });

    // Screen 5: Submit
    document.getElementById('btn-submit').addEventListener('click', submitForm);
    document.getElementById('btn-send-refuse').addEventListener('click', submitForm);
}

// ===== HELPER FUNCTIONS =====
function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (show) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(input => input.value);
}

// ===== SCREEN: DATES =====
function validateDates() {
    state.dates = getCheckedValues('date');
    
    if (state.dates.includes('custom')) {
        state.customDates = document.getElementById('custom-dates-text').value;
        if (!state.customDates) {
            alert('Veuillez indiquer vos disponibilités');
            return;
        }
    }
    
    if (state.dates.length === 0) {
        alert('Veuillez sélectionner au moins une option');
        return;
    }
    
    showScreen('screen-destination');
}

function resetDatesScreen() {
    document.querySelectorAll('input[name="date"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('custom-dates-text').value = '';
    toggleElement('custom-dates-input', false);
}

// ===== SCREEN: DESTINATION =====
function validateDestination() {
    state.destinations = getCheckedValues('destination');
    
    if (state.destinations.includes('custom')) {
        state.customDestination = document.getElementById('custom-destination-text').value;
        if (!state.customDestination) {
            alert('Veuillez indiquer votre suggestion');
            return;
        }
    }
    
    if (state.destinations.length === 0) {
        alert('Veuillez sélectionner au moins une destination');
        return;
    }
    
    showAccommodationScreen();
}

function resetDestinationScreen() {
    document.querySelectorAll('input[name="destination"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('custom-destination-text').value = '';
    toggleElement('custom-destination-input', false);
}

// ===== SCREEN: ACCOMMODATION =====
function showAccommodationScreen() {
    const accommodationList = state.destinations
        .filter(d => d !== 'custom')
        .map(dest => {
            const destKey = dest === 'rocamadour' ? 'rocamadour' : 'salagou';
            return `
                <a href="${CONFIG.AIRBNB_LINKS[destKey]}" target="_blank" class="accommodation-link">
                    <div class="accommodation-card">
                        <h4>${dest === 'rocamadour' ? 'Rocamadour' : 'Lac du Salagou'}</h4>
                        <p>Voir les logements →</p>
                    </div>
                </a>
            `;
        })
        .join('');

    if (state.customDestination) {
        accommodationList += '<p class="custom-note">Nous vous enverrons des suggestions pour ' + state.customDestination + '</p>';
    }

    document.getElementById('accommodation-content').innerHTML = accommodationList;
    showScreen('screen-accommodation');
}

// ===== SCREEN: SUMMARY =====
function showSummary() {
    displaySummaryDates();
    displaySummaryDestination();
    displaySummaryAccommodation();
    displaySummaryProgram();
    updateBudgetDisplay();
    
    showScreen('screen-summary');
}

function displaySummaryDates() {
    let datesText = '';
    
    const standardDates = state.dates.filter(d => d !== 'custom');
    if (standardDates.length > 0) {
        datesText = standardDates.join(', ');
    }
    
    if (state.customDates) {
        datesText += (datesText ? ' ou ' : '') + state.customDates;
    }
    
    document.getElementById('summary-dates').innerHTML = `<p>${datesText || 'Non spécifiées'}</p>`;
}

function displaySummaryDestination() {
    let destText = '';
    
    const standardDests = state.destinations
        .filter(d => d !== 'custom')
        .map(d => d === 'rocamadour' ? 'Rocamadour' : 'Lac du Salagou');
    
    if (standardDests.length > 0) {
        destText = standardDests.join(', ');
    }
    
    if (state.customDestination) {
        destText += (destText ? ' ou ' : '') + state.customDestination;
    }
    
    document.getElementById('summary-destination').innerHTML = `<p>${destText || 'Non spécifiée'}</p>`;
}

function displaySummaryAccommodation() {
    const feedback = document.getElementById('accommodation-text').value || 'Logement validé';
    document.getElementById('summary-accommodation').innerHTML = `<p>${feedback}</p>`;
}

function displaySummaryProgram() {
    let programHTML = '';
    
    const rocamadourSelected = state.destinations.includes('rocamadour');
    const salagouSelected = state.destinations.includes('salagou');
    
    if (rocamadourSelected) {
        programHTML += '<div class="program-item"><strong>🏰 Rocamadour</strong><ul>';
        CONFIG.PROGRAMS.rocamadour.forEach(activity => {
            programHTML += `<li>${activity}</li>`;
        });
        programHTML += '</ul></div>';
    }
    
    if (salagouSelected) {
        programHTML += '<div class="program-item"><strong>🌊 Lac du Salagou</strong><ul>';
        CONFIG.PROGRAMS.salagou.forEach(activity => {
            programHTML += `<li>${activity}</li>`;
        });
        programHTML += '</ul></div>';
    }
    
    if (state.customDestination) {
        programHTML += `<p><em>Le programme sera confirmé selon les disponibilités pour ${state.customDestination}</em></p>`;
    }
    
    document.getElementById('summary-program').innerHTML = programHTML || '<p>Programme à définir</p>';
}

function updateBudgetDisplay() {
    const budgetText = state.budget > 0 ? state.budget + ' €' : 'Non défini';
    document.getElementById('budget-display').textContent = budgetText;
}

// ===== REFUSAL =====
function refuseIntro() {
    const messages = CONFIG.REFUSAL_MESSAGES;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('refuse-message').textContent = randomMessage;
    
    showScreen('screen-refuse');
}

// ===== FORM SUBMISSION =====
function submitForm() {
    const summary = compileSummary();
    
    // Update form hidden field
    document.getElementById('form-message').value = summary;
    
    // Update email from CONFIG
    const form = document.getElementById('hidden-form');
    form.action = `https://formsubmit.co/${CONFIG.EMAIL}`;
    
    // Submit
    form.submit();
}

function compileSummary() {
    let summary = '=== PROPOSITION WEEK-END ===\n\n';
    
    // Dates
    summary += '📅 DATES PROPOSÉES:\n';
    const datesList = state.dates.filter(d => d !== 'custom').join(', ') || 'Non sélectionnées';
    summary += datesList + '\n';
    if (state.customDates) {
        summary += 'Alternative: ' + state.customDates + '\n';
    }
    summary += '\n';
    
    // Destinations
    summary += '📍 DESTINATIONS:\n';
    const destsList = state.destinations
        .filter(d => d !== 'custom')
        .map(d => d === 'rocamadour' ? 'Rocamadour' : 'Lac du Salagou')
        .join(', ') || 'Non sélectionnées';
    summary += destsList + '\n';
    if (state.customDestination) {
        summary += 'Alternative: ' + state.customDestination + '\n';
    }
    summary += '\n';
    
    // Logement feedback
    summary += '🏠 LOGEMENT:\n';
    const accommodationText = document.getElementById('accommodation-text').value || 'Validé';
    summary += accommodationText + '\n\n';
    
    // Budget
    summary += '💰 BUDGET: ';
    summary += (state.budget > 0 ? state.budget + ' €' : 'Non défini') + '\n\n';
    
    // Program
    summary += '🗓️ PROGRAMME ENVISAGÉ:\n';
    if (state.destinations.includes('rocamadour')) {
        summary += 'Rocamadour:\n';
        CONFIG.PROGRAMS.rocamadour.forEach(activity => {
            summary += '  - ' + activity + '\n';
        });
    }
    if (state.destinations.includes('salagou')) {
        summary += 'Lac du Salagou:\n';
        CONFIG.PROGRAMS.salagou.forEach(activity => {
            summary += '  - ' + activity + '\n';
        });
    }
    
    summary += '\n=== FIN DU RÉCAPITULATIF ===';
    
    return summary;
}

function setupEventListeners() {
    // Add event listeners for introduction buttons
    document.getElementById("seePropositions").addEventListener("click", showDateSelection);
    document.getElementById("noThanks").addEventListener("click", handleNoThanks);
    
    // Add event listeners for date selection
    document.getElementById("dateSelectionForm").addEventListener("submit", handleDateSelection);
    
    // Add event listeners for destination selection
    document.getElementById("destinationSelectionForm").addEventListener("submit", handleDestinationSelection);
    
    // Add event listeners for logement selection
    document.getElementById("logementSelectionForm").addEventListener("submit", handleLogementSelection);
    
    // Add event listener for summary submission
    document.getElementById("summaryForm").addEventListener("submit", handleSummarySubmission);
}

function showDateSelection() {
    // Logic to display date selection screen
}

function handleNoThanks() {
    // Logic to handle "No thanks" response
    alert("Pas de souci, on peut toujours en parler plus tard !");
}

function handleDateSelection(event) {
    event.preventDefault();
    // Logic to handle date selection
}

function handleDestinationSelection(event) {
    event.preventDefault();
    // Logic to handle destination selection
}

function handleLogementSelection(event) {
    event.preventDefault();
    // Logic to handle logement selection
}

function handleSummarySubmission(event) {
    event.preventDefault();
    // Logic to handle summary submission and send email via Formsubmit
}

function sendEmail() {
    // Logic to send email using Formsubmit
}