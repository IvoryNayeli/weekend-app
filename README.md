# 🌿 Weekend Parcours – Proposition Romantique Interactive

Une expérience web moderne et élégante pour proposer un week-end mémorable. Application mobile-first sans backend, prête pour GitHub Pages.

## ✨ Caractéristiques

### Parcours Utilisateur Complet
- **Écran 1 – Introduction** : Message de bienvenue avec choix direct (accepter/refuser)
- **Écran 2 – Dates** : Selection multiple parmi 3 options ou saisie de dates personnalisées
- **Écran 3 – Destination** : Choix entre 2 destinations (Rocamadour, Lac du Salagou) avec alternative
- **Écran 4 – Logement** : Cartes Airbnb adaptées à chaque destination + feedback optionnel
- **Écran 5 – Récapitulatif** : Résumé complet avec programme suggested, budget modifiable
- **Email** : Envoi automatique sans backend via FormSubmit

### Design & UX
- 📱 **Mobile-first** – Parfait sur tous les appareils
- 🎨 **Design moderne** – Gradients, transitions fluides, micro-interactions
- ✨ **Transitions élégantes** – Animations subtiles fade/slide
- ♿ **Accessible** – Support des visiteurs avec animations réduites

### Configuration Centralisée
Tous les éléments personnalisables dans `script.js` :
```javascript
CONFIG = {
    EMAIL: "your-email@example.com",           // ← À modifier
    REFUSAL_MESSAGES: [/* Messages personnalisés */],
    PROGRAMS: { rocamadour: [...], salagou: [...] },
    AIRBNB_LINKS: { rocamadour: "url", salagou: "url" }
}
```

## 🚀 Déploiement Rapide

### 1. GitHub Pages (Recommandé - Gratuit)
Le site est déjà prêt ! Il suffit de :

1. Aller sur https://github.com/IvoryNayeli/weekend-app/settings/pages
2. Sélectionner "Deploy from a branch"
3. Choisir `main` comme branche source
4. Cliquer "Save"

Le site sera accessible en quelques minutes à :
```
https://IvoryNayeli.github.io/weekend-app/
```

### 2. Configuration Email (Pratique)
Avant de partager le lien, mettez à jour l'email récepteur :

**Dans `script.js`, ligne 8 :**
```javascript
CONFIG = {
    EMAIL: "votre-email@gmail.com",  // ← Remplacez ici
    // ...
}
```

Puis commitez et poussez.

### 3. Personnalisation (Optionnel)

#### Messages de refus
```javascript
REFUSAL_MESSAGES: [
    "Je comprends, ce n'est pas grave ! 😊",
    "Pas de problème, on trouvera une autre occasion !",
    "Pas de souci, bisous ! 💙"
]
```

#### Programmes par destination
```javascript
PROGRAMS: {
    "rocamadour": [
        "🏰 Visite de Rocamadour",
        "🕳️ Gouffre de Padirac",
        // Ajoutez ou modifiez les activités
    ],
    "salagou": [
        "🥾 Randonnée autour du lac",
        // ...
    ]
}
```

#### Liens Airbnb
```javascript
AIRBNB_LINKS: {
    "rocamadour": "https://www.airbnb.fr/wishlists/...",
    "salagou": "https://www.airbnb.fr/wishlists/..."
}
```

## 📋 Structure du Projet

```
weekend-app/
├── index.html              # Structure HTML des 5 écrans
├── style.css               # Design mobile-first + responsive
├── script.js               # Logique + config centralisée
├── assets/
│   ├── destinations/       # Images destinations (gradients CSS par défaut)
│   └── logements/          # Images logements (gradients CSS par défaut)
├── README.md               # Cette documentation
└── .git/                   # Repository Git
```

## 🛠️ Technologies

- **HTML5** – Structure sémantique
- **CSS3** – Flexbox, Grid, Gradients, Animations
- **Vanilla JavaScript** – Aucune dépendance externe
- **FormSubmit** – Envoi email sans backend

## 🎯 Parcours API / Données

### État utilisateur (`state` object)
```javascript
state = {
    dates: [],                    // ["15-17-mai", "12-14-juin"] ou ["custom"]
    customDates: "",             // Saisie libre si custom sélectionné
    destinations: [],            // ["rocamadour", "salagou"] ou ["custom"]
    customDestination: "",       // Saisie libre si custom sélectionné
    accommodationFeedback: "",   // Retours utilisateur sur logement
    budget: 0                    // Budget en euros
}
```

### Fonction de soumission
```javascript
submitForm()  // Compile le résumé et le poste à FormSubmit
```

## 📧 Emails Reçus

Voici le format du message reçu pour chaque soumission :

```
=== PROPOSITION WEEK-END ===

📅 DATES PROPOSÉES:
15–17 mai
Alternative: Nous sommes libres en juillet

📍 DESTINATIONS:
Rocamadour
Alternative: Côte d'Azur

🏠 LOGEMENT:
Le logement semble confortable, mais préférerais proche de la ville

💰 BUDGET: 1500 €

🗓️ PROGRAMME ENVISAGÉ:
Rocamadour:
  - 🏰 Visite de Rocamadour
  - 🕳️ Gouffre de Padirac
  - 🏘️ Arrêt à Saint-Cirq-Lapopie en chemin
  - 🎨 Grotte des Merveilles

=== FIN DU RÉCAPITULATIF ===
```

## 🔧 Développement Local

### Lancer localement
```bash
# Serveur HTTP simple
python3 -m http.server 8000

# Puis visiter : http://localhost:8000
```

### Git Workflow
```bash
# Cloner
git clone https://github.com/IvoryNayeli/weekend-app.git

# Modifier et committer
git add .
git commit -m "update: modify program activities"
git push origin main
```

## 🌐 Navigation entre écrans

| Écran | ID | Événement |
|-------|----|----|
| Introduction | `screen-intro` | Clic "Voir propositions" ou "Non merci" |
| Dates | `screen-dates` | Validation sélection dates |
| Destination | `screen-destination` | Validation sélection destination |
| Logement | `screen-accommodation` | Après destination |
| Récapitulatif | `screen-summary` | Validation logement |
| Refus | `screen-refuse` | Clic "Non merci" (introduction) |

## 🎨 Design Responsive

- **Mobile (< 480px)** : Une colonne, texte réduit
- **Tablet/Desktop (> 480px)** : Layout optimisé, grille 2 colonnes pour destinations

## ✅ À Vérifier Avant Partage

- [ ] Email configuré dans `CONFIG.EMAIL` (script.js:8)
- [ ] Liens Airbnb à jour
- [ ] GitHub Pages activé
- [ ] Test du formulaire avec un email test
- [ ] Vérifier réception d'emails

## 📞 Support FormSubmit

En cas de problème d'envoi email :
- Consulter https://formsubmit.co/
- Vérifier que l'email est correct en script.js
- Tester depuis une page publique (pas localhost)

## 📄 Licence

Libre d'utilisation et de modification. Personnalisez à votre goût ! 💌

---

**Créé avec ❤️ pour un week-end inoubliable.**
│   │   └── rocamadour.jpg
│   └── logements
│       ├── salagou-airbnb.jpg
│       └── rocamadour-airbnb.jpg
├── index.html
├── style.css
├── script.js
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd weekend-parcours-app
   ```
3. Open `index.html` in a web browser to view the application.

## Deployment on GitHub Pages
1. Push the project to a GitHub repository.
2. Go to the repository settings on GitHub.
3. Scroll down to the "GitHub Pages" section.
4. Select the main branch as the source and save.
5. Access your application at `https://<username>.github.io/<repository-name>/`.

## Customization
- Modify the email recipient in `script.js` to change where the summary is sent.
- Adjust the program details in `script.js` to customize the weekend itinerary based on selected destinations.

## License
This project is open-source and available under the MIT License.