# RunTogether - Blog de Course à Pied

## 🏃‍♂️ Présentation

RunTogether est un blog dédié à la passion de la course à pied, proposant des articles, tests de matériel, conseils d'entraînement et une communauté active de coureurs.

## ✨ Fonctionnalités Interactives

Ce projet implémente plusieurs fonctionnalités JavaScript éco-conçues pour améliorer l'expérience utilisateur :

### 🎯 Fonctionnalités Principales

#### 1. **Message de Bienvenue Personnalisé**

- **Localisation** : Page d'accueil (`index.html`)
- **Description** : Permet aux visiteurs de saisir leur prénom pour recevoir un message de bienvenue personnalisé
- **Sécurité** : Validation et sanitisation des entrées pour prévenir les injections XSS
- **Accessibilité** : Support complet des lecteurs d'écran et navigation clavier

#### 2. **Masquer/Afficher les Articles**

- **Localisation** : Toutes les pages avec articles
- **Description** : Bouton permettant de masquer temporairement un article de la vue
- **Fonctionnement** : Clic sur "👁️ Masquer l'article" pour cacher, re-clic pour afficher
- **Persistance** : État maintenu pendant la session

#### 3. **Filtrage par Catégorie**

- **Localisation** : Page articles (`articles.html`)
- **Description** : Liste déroulante pour filtrer les articles par catégorie
- **Catégories disponibles** : Actu, Test, Entraînement, etc.
- **Performance** : Fonction debounce pour optimiser les performances

## 🛠️ Installation et Utilisation

### Prérequis

- Navigateur web moderne (Chrome 80+, Firefox 75+, Safari 13+)
- Serveur web local (recommandé : Live Server de VS Code)

### Installation

1. Cloner ou télécharger le projet
2. Ouvrir le dossier dans votre éditeur de code
3. Lancer un serveur local (ex: Live Server)
4. Accéder à `index.html`

### Structure des Fichiers

```
📁 Devoir n°2/
├── 📄 index.html          # Page d'accueil avec message de bienvenue
├── 📄 articles.html       # Page de listing avec filtrage
├── 📄 article.html        # Page d'article individuel
├── 📄 about.html         # Page à propos
├── 📄 package.json       # Configuration du projet
├── 📁 assets/
│   ├── 📁 js/
│   │   └── 📄 main.js     # Script principal avec toutes les fonctionnalités
│   ├── 📁 images/         # Images optimisées (WebP + fallbacks)
│   └── 📁 css/
├── 📁 css/
│   └── 📄 styles.min.css  # Styles CSS avec nouvelles fonctionnalités
└── 📁 tests/
    └── 📄 main.test.js    # Tests unitaires et de sécurité
```

## 🧪 Tests

### Exécution des Tests

#### Dans le navigateur (Recommandé)

1. Ouvrir `index.html` en développement local
2. Ouvrir la console développeur (F12)
3. Taper : `runAllTests()`
4. Observer les résultats des tests

#### En ligne de commande

```bash
# Installation des dépendances (optionnel)
npm install

# Exécution des tests
npm test

# Validation du code JavaScript
npm run validate
```

### Types de Tests

#### 🔒 **Tests de Sécurité**

- Prévention des injections XSS
- Validation des entrées utilisateur
- Sanitisation des données

#### ⚡ **Tests de Performance**

- Optimisation des fonctions avec debounce
- Mesure du temps d'exécution
- Respect de l'éco-conception

#### 🎯 **Tests Fonctionnels**

- Message de bienvenue personnalisé
- Masquage/affichage d'articles
- Filtrage par catégorie
- Navigation et accessibilité

## 🌱 Éco-Conception

Ce projet applique les principes d'éco-conception numérique :

### Optimisations Implémentées

- **Images** : Format WebP avec fallback, lazy loading
- **JavaScript** : Debounce pour limiter les calculs
- **CSS** : Styles minifiés, animations respectant `prefers-reduced-motion`
- **Performance** : Chargement conditionnel des scripts de test
- **Mémoire** : Nettoyage automatique des événements

### Bonnes Pratiques

- Code modulaire et réutilisable
- Gestion d'erreurs robuste
- Validation côté client pour réduire les requêtes serveur
- Minimisation de l'impact énergétique

## 🔧 Configuration

### Personnalisation des Catégories

Les catégories d'articles sont automatiquement détectées via l'attribut `data-category` :

```html
<article class="card" data-category="test" id="article-1">
  <!-- Contenu de l'article -->
</article>
```

### Ajout de Nouvelles Fonctionnalités

Le système est modulaire. Pour ajouter une fonctionnalité :

1. Créer une nouvelle classe dans `assets/js/main.js`
2. L'initialiser dans `RunTogetherApp.initializeComponents()`
3. Ajouter les styles CSS correspondants
4. Créer les tests appropriés

## 🎨 Personnalisation des Styles

Les nouvelles fonctionnalités utilisent les variables CSS existantes :

```css
:root {
  --navy: #0c3d5a; /* Couleur principale */
  --green: #087035; /* Couleur d'accent */
  --blue: #0c3d5a; /* Couleur des boutons */
  --text: #0f172a; /* Couleur du texte */
  --muted: #667085; /* Texte secondaire */
}
```

## 📱 Responsive Design

Toutes les nouvelles fonctionnalités sont entièrement responsives :

- **Desktop** : Interface complète avec toutes les fonctionnalités
- **Tablette** : Adaptation du layout et des interactions
- **Mobile** : Interface optimisée avec menus empilés

## ♿ Accessibilité

Conformité WCAG 2.1 AA :

- Navigation clavier complète
- Support des lecteurs d'écran
- Contrastes de couleurs respectés
- Attributs ARIA appropriés
- Focus visible et logique

## 🚀 Performance

Optimisations implémentées :

- Chargement différé des images
- Debounce sur les interactions utilisateur
- Minimisation des reflows/repaints
- Gestion de la mémoire optimisée

## 🔍 Debugging

Pour debugger les fonctionnalités :

1. Ouvrir la console développeur
2. Accéder aux composants : `window.RunTogetherApp`
3. Utiliser les méthodes de debug intégrées
4. Exécuter les tests pour identifier les problèmes

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier de licence pour plus de détails.

## 👥 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche pour votre fonctionnalité
3. Respecter les conventions de code établies
4. Ajouter les tests appropriés
5. Soumettre une pull request

## 📞 Support

Pour toute question ou problème :

- Consulter les tests pour comprendre le fonctionnement attendu
- Vérifier la console pour les messages d'erreur
- Examiner le code source commenté

---

**RunTogether** - Courir ensemble, chacun à son rythme ! 🏃‍♂️💨
