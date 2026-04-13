// ===== CONFIG =====
const CONFIG = {
    // Email pour FormSubmit (à modifier)
    EMAIL: "your-email@example.com",
    
    // Message de sortie anticipée
    EARLY_EXIT_MESSAGE: "Pas de souci, focus sur les vacances d'août dans ce cas ! ❤️",
    
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
    accommodationFeedback: ""
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
    const btnSeeProposals = document.getElementById('btn-see-proposals');
    const btnRefuseIntro = document.getElementById('btn-refuse-intro');
    
    if (btnSeeProposals) {
        btnSeeProposals.addEventListener('click', () => {
            showScreen('screen-dates');
        });
    }

    if (btnRefuseIntro) {
        btnRefuseIntro.addEventListener('click', refuseIntro);
    }

    // Screen 2: Dates
    const dateCustom = document.getElementById('date-custom');
    if (dateCustom) {
        dateCustom.addEventListener('change', (e) => {
            toggleElement('custom-dates-input', e.target.checked);
        });
    }

    const btnValidateDates = document.getElementById('btn-validate-dates');
    if (btnValidateDates) {
        btnValidateDates.addEventListener('click', validateDates);
    }

    // Screen 3: Destination
    document.querySelectorAll('.destination-button').forEach((button) => {
        button.addEventListener('click', () => {
            selectPresetDestination(button.dataset.destination);
        });
    });

    const btnDestinationNone = document.getElementById('btn-destination-none');
    if (btnDestinationNone) {
        btnDestinationNone.addEventListener('click', () => {
            toggleElement('custom-destination-input', true);
        });
    }

    const btnValidateCustomDestination = document.getElementById('btn-validate-custom-destination');
    if (btnValidateCustomDestination) {
        btnValidateCustomDestination.addEventListener('click', validateCustomDestination);
    }

    // Screen 4: Accommodation
    const btnAccommodationPerfect = document.getElementById('btn-accommodation-perfect');
    if (btnAccommodationPerfect) {
        btnAccommodationPerfect.addEventListener('click', showSummary);
    }

    const btnAccommodationIssue = document.getElementById('btn-accommodation-issue');
    if (btnAccommodationIssue) {
        btnAccommodationIssue.addEventListener('click', () => {
            toggleElement('accommodation-feedback', true);
        });
    }

    // Screen 5: Submit
    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', submitForm);
    }

}

// ===== HELPER FUNCTIONS =====
function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
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
        const customDatesInput = document.getElementById('custom-dates-text');
        state.customDates = customDatesInput ? customDatesInput.value : '';
        if (!state.customDates) {
            endJourney(CONFIG.EARLY_EXIT_MESSAGE);
            return;
        }
    }
    
    if (state.dates.length === 0) {
        alert('Choisis au moins une option');
        return;
    }
    
    showScreen('screen-destination');
}

function resetDatesScreen() {
    document.querySelectorAll('input[name="date"]').forEach(input => {
        input.checked = false;
    });
    const customDatesText = document.getElementById('custom-dates-text');
    if (customDatesText) {
        customDatesText.value = '';
    }
    toggleElement('custom-dates-input', false);
}

// ===== SCREEN: DESTINATION =====
function selectPresetDestination(destination) {
    state.destinations = [destination];
    state.customDestination = '';
    showAccommodationScreen();
}

function validateCustomDestination() {
    const customDestInput = document.getElementById('custom-destination-text');
    state.customDestination = customDestInput ? customDestInput.value.trim() : '';
    state.destinations = ['custom'];

    if (!state.customDestination) {
        endJourney(CONFIG.EARLY_EXIT_MESSAGE);
        return;
    }

    showAccommodationScreen();
}

// ===== SCREEN: ACCOMMODATION =====
function showAccommodationScreen() {
    let accommodationList = state.destinations
        .filter(d => d !== 'custom')
        .map(dest => {
            const destKey = dest === 'rocamadour' ? 'rocamadour' : 'salagou';
            return `
                <a href="${CONFIG.AIRBNB_LINKS[destKey]}" target="_blank" class="accommodation-link">
                    <div class="accommodation-card">
                        <h4>${dest === 'rocamadour' ? 'Rocamadour' : 'Lac du Salagou'}</h4>
                        <p class="accommodation-subtitle">Sélection de logements pour toi</p>
                        <span class="accommodation-cta">Ouvrir la liste Airbnb</span>
                    </div>
                </a>
            `;
        })
        .join('');

    if (state.customDestination) {
        accommodationList += '<p class="custom-note">On te proposera des logements pour ' + state.customDestination + '.</p>';
    }

    const accommodationContent = document.getElementById('accommodation-content');
    if (accommodationContent) {
        accommodationContent.innerHTML = accommodationList;
    }
    showScreen('screen-accommodation');
}

// ===== SCREEN: SUMMARY =====
function showSummary() {
    displaySummaryDates();
    displaySummaryDestination();
    displaySummaryAccommodation();
    displaySummaryProgram();
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
    
    const summaryDates = document.getElementById('summary-dates');
    if (summaryDates) {
        summaryDates.innerHTML = `<p>${datesText || 'Non spécifiées'}</p>`;
    }
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
    
    const summaryDestination = document.getElementById('summary-destination');
    if (summaryDestination) {
        summaryDestination.innerHTML = `<p>${destText || 'Non spécifiée'}</p>`;
    }
}

function displaySummaryAccommodation() {
    const accommodationText = document.getElementById('accommodation-text');
    const feedback = accommodationText ? accommodationText.value : 'Logement validé';
    const summaryAccommodation = document.getElementById('summary-accommodation');
    if (summaryAccommodation) {
        summaryAccommodation.innerHTML = `<p>${feedback || 'Logement validé'}</p>`;
    }
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
    
    const summaryProgram = document.getElementById('summary-program');
    if (summaryProgram) {
        summaryProgram.innerHTML = programHTML || '<p>Programme à définir</p>';
    }
}

// ===== REFUSAL =====
function refuseIntro() {
    endJourney(CONFIG.EARLY_EXIT_MESSAGE);
}

function endJourney(message) {
    const refuseMessage = document.getElementById('refuse-message');

    if (refuseMessage) {
        refuseMessage.textContent = message;
    }

    showScreen('screen-refuse');
}

// ===== FORM SUBMISSION =====
function submitForm() {
    const summary = compileSummary();
    
    // Update form hidden field
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.value = summary;
    }
    
    // Update email from CONFIG
    const form = document.getElementById('hidden-form');
    if (form) {
        form.action = `https://formsubmit.co/${CONFIG.EMAIL}`;
        form.submit();
    }
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
    const accommodationText = document.getElementById('accommodation-text');
    const accommodationFeedback = accommodationText ? accommodationText.value : 'Validé';
    summary += (accommodationFeedback || 'Validé') + '\n\n';
    
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