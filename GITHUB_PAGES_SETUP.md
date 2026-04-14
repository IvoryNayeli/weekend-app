# 🚀 Activer GitHub Pages - Guide Rapide

## Votre repo est prêt ! Deux étapes pour mettre en ligne :

### Étape 1️⃣ : Configurer GitHub Pages (2 minutes)

1. **Ouvrez votre repo GitHub**
   - Lien : https://github.com/IvoryNayeli/weekend-app

2. **Allez dans Settings**
   - Cliquez sur ⚙️ "Settings" en haut à droite

3. **Pages section**
   - Dans le menu de gauche, cliquez sur "Pages"

4. **Sélectionnez la source**
   - Sous "Build and deployment"
   - Dans "Source", cochez "Deploy from a branch"
   - Branch: sélectionnez **main**
   - Folder: laissez **/root** (défaut)
   - Cliquez **Save**

5. ⏳ **Attendez 1-2 minutes**
   - GitHub va automatiquement déployer votre site
   - Vous verrez un message vert "Your site is live at..."

### Étape 2️⃣ : Configurer votre email (Incontournable avant partage)

Le formulaire doit envoyer à votre email. Pour configurer :

1. **Ouvrez `script.js`** dans votre repo
2. **Ligne 8, cherchez :**
   ```javascript
   EMAIL: "your-email@example.com",
   ```
3. **Remplacez par votre vrai email:**
   ```javascript
   EMAIL: "mon-email@gmail.com",
   ```
4. **Sauvegardez et committez :**
   ```bash
   git add script.js
   git commit -m "config: update email for form submissions"
   git push origin main
   ```

### ✅ C'est bon ! Votre site est en ligne

**URL de votre site :**
```
https://IvoryNayeli.github.io/weekend-app/
```

🎉 Partagez ce lien avec votre personne spéciale !

---

## 🎨 Personnaliser (Optionnel)

Vous pouvez aussi modifier dans `script.js` :

- **Messages de refus** (ligne 11-15) - Personnalisez les réponses gentilles
- **Programmes** (ligne 17-28) - Ajoutez/modifiez les activités proposées
- **Liens Airbnb** (ligne 30-34) - Mettez à jour vos wishlists Airbnb
- **Budget** - Modifiable directement dans le récapitulatif par l'utilisateur

Puis commitez et le site se met à jour automatiquement ! ✨

---

## 📧 Vérifier que les emails fonctionnent

1. Ouvrez votre site en ligne
2. Complétez le parcours entièrement
3. C'est rejeté ? Attendez 5 secondes après clic "Envoyer"
4. Vérifiez votre email (et dossier spam 🤨)

**Problème persistent ?** 
- Vérifiez que l'email dans script.js est correct
- Utilisez un email Gmail (plus fiable avec FormSubmit)
- Consultez https://formsubmit.co pour plus d'aide

---

Bon week-end ! 💌✨
