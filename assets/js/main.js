/**
 * RunTogether - Fonctionnalités JavaScript interactives
 * Optimisé pour l'éco-conception et la performance
 */

"use strict";

// =============================================================================
// UTILITAIRES ET SÉCURITÉ
// =============================================================================

/**
 * Fonction de sanitisation pour prévenir les injections XSS
 * @param {string} input - Texte à nettoyer
 * @returns {string} - Texte nettoyé
 */
function sanitizeInput(input) {
  if (typeof input !== "string") return "";

  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML.trim();
}

/**
 * Validation des entrées utilisateur
 * @param {string} input - Entrée à valider
 * @param {number} maxLength - Longueur maximale autorisée
 * @returns {boolean} - True si valide
 */
function validateInput(input, maxLength = 50) {
  if (!input || typeof input !== "string") return false;
  return input.trim().length > 0 && input.length <= maxLength;
}

/**
 * Debounce pour optimiser les performances
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai en millisecondes
 * @returns {Function} - Fonction débouncée
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// =============================================================================
// FONCTIONNALITÉ 1: MESSAGE DE BIENVENUE PERSONNALISÉ
// =============================================================================

class WelcomeMessage {
  constructor() {
    this.init();
  }

  init() {
    const form = document.getElementById("welcome-form");
    const nameInput = document.getElementById("name-input");
    const welcomeBtn = document.getElementById("welcome-btn");
    const messageArea = document.getElementById("welcome-message");

    if (!form || !nameInput || !welcomeBtn || !messageArea) {
      console.warn("Éléments du formulaire de bienvenue non trouvés");
      return;
    }

    // Gestionnaire d'événements avec validation et sécurité
    const handleWelcome = (e) => {
      e.preventDefault();

      const nameValue = nameInput.value;

      // Validation de l'entrée
      if (!validateInput(nameValue, 30)) {
        this.showMessage(
          "Veuillez saisir un prénom valide (1-30 caractères).",
          "error",
          messageArea
        );
        nameInput.focus();
        return;
      }

      // Sanitisation et affichage du message
      const safeName = sanitizeInput(nameValue);
      const welcomeText = `🏃‍♂️ Bienvenue ${safeName} ! Prêt pour votre prochaine course ?`;

      this.showMessage(welcomeText, "success", messageArea);

      // Nettoyage du formulaire
      nameInput.value = "";
    };

    // Événements
    form.addEventListener("submit", handleWelcome);
    welcomeBtn.addEventListener("click", handleWelcome);

    // Validation en temps réel avec debounce
    const debouncedValidation = debounce((e) => {
      const isValid = validateInput(e.target.value, 30);
      nameInput.classList.toggle(
        "invalid",
        !isValid && e.target.value.length > 0
      );
      welcomeBtn.disabled = !isValid;
    }, 300);

    nameInput.addEventListener("input", debouncedValidation);
  }

  showMessage(text, type, container) {
    container.innerHTML = `<div class="message message--${type}" role="alert" aria-live="polite">${text}</div>`;

    // Suppression automatique du message après 5 secondes
    setTimeout(() => {
      if (container.firstChild) {
        container.firstChild.remove();
      }
    }, 5000);
  }
}

// =============================================================================
// FONCTIONNALITÉ 2: MASQUER/AFFICHER ARTICLES
// =============================================================================

class ArticleToggle {
  constructor() {
    this.hiddenArticles = new Set();
    this.init();
  }

  init() {
    const toggleButtons = document.querySelectorAll(".article-toggle-btn");

    toggleButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleToggle(e));
    });
  }

  handleToggle(e) {
    const button = e.target;
    const articleId = button.dataset.articleId;

    if (!articleId) {
      console.warn("ID d'article manquant");
      return;
    }

    const article = document.getElementById(articleId);
    if (!article) {
      console.warn(`Article avec l'ID ${articleId} non trouvé`);
      return;
    }

    const isHidden = this.hiddenArticles.has(articleId);

    if (isHidden) {
      this.showArticle(article, button, articleId);
    } else {
      this.hideArticle(article, button, articleId);
    }
  }

  hideArticle(article, button, articleId) {
    article.style.display = "none";
    article.setAttribute("aria-hidden", "true");

    // Mise à jour du texte du bouton
    button.textContent = "Afficher l'article";
    button.setAttribute("aria-label", "Afficher l'article masqué");
    button.classList.add("hidden-state");

    this.hiddenArticles.add(articleId);
  }

  showArticle(article, button, articleId) {
    article.style.display = "";
    article.removeAttribute("aria-hidden");

    // Restauration du texte du bouton
    button.textContent = "Masquer l'article";
    button.setAttribute("aria-label", "Masquer cet article");
    button.classList.remove("hidden-state");

    this.hiddenArticles.delete(articleId);
  }

  // Méthode pour restaurer tous les articles (utile pour les tests)
  showAllArticles() {
    this.hiddenArticles.forEach((articleId) => {
      const article = document.getElementById(articleId);
      const button = document.querySelector(`[data-article-id="${articleId}"]`);

      if (article && button) {
        this.showArticle(article, button, articleId);
      }
    });
  }
}

// =============================================================================
// FONCTIONNALITÉ 3: FILTRAGE PAR CATÉGORIE
// =============================================================================

class ArticleFilter {
  constructor() {
    this.articles = [];
    this.currentFilter = "all";
    this.init();
  }

  init() {
    // Récupération des articles avec leurs catégories
    this.articles = Array.from(
      document.querySelectorAll(".card[data-category]")
    ).map((article) => ({
      element: article,
      category: article.dataset.category.toLowerCase(),
      visible: true,
    }));

    // Initialisation du sélecteur de catégorie
    const categorySelect = document.getElementById("category-filter");
    if (!categorySelect) {
      console.warn("Sélecteur de catégorie non trouvé");
      return;
    }

    // Génération automatique des options de catégorie
    this.populateCategoryOptions(categorySelect);

    // Gestionnaire d'événements avec debounce pour la performance
    const debouncedFilter = debounce((e) => {
      this.filterArticles(e.target.value);
    }, 150);

    categorySelect.addEventListener("change", debouncedFilter);

    // Compteur d'articles
    this.updateResultCount();
  }

  populateCategoryOptions(selectElement) {
    // Extraction des catégories uniques
    const categories = [
      ...new Set(this.articles.map((article) => article.category)),
    ];

    // Nettoyage des options existantes (sauf "Toutes les catégories")
    const existingOptions = Array.from(selectElement.options);
    existingOptions.forEach((option, index) => {
      if (index > 0) option.remove();
    });

    // Ajout des nouvelles options
    categories.sort().forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = this.formatCategoryName(category);
      selectElement.appendChild(option);
    });
  }

  formatCategoryName(category) {
    // Formatage du nom de catégorie pour l'affichage
    const categoryMap = {
      actu: "Actu",
      "actu-produits": "Actu produits",
      "a-la-une": "À la une",
      entrainement: "Entraînement",
      conseil: "Conseil",
      nutrition: "Nutrition",
    };

    return (
      categoryMap[category] ||
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
    );
  }

  filterArticles(selectedCategory) {
    this.currentFilter = selectedCategory;
    let visibleCount = 0;

    this.articles.forEach((article) => {
      const shouldShow =
        selectedCategory === "all" || article.category === selectedCategory;

      if (shouldShow) {
        article.element.style.display = "";
        article.element.removeAttribute("aria-hidden");
        article.visible = true;
        visibleCount++;
      } else {
        article.element.style.display = "none";
        article.element.setAttribute("aria-hidden", "true");
        article.visible = false;
      }
    });

    this.updateResultCount(visibleCount);
    this.announceFilterChange(selectedCategory, visibleCount);
  }

  updateResultCount(count = null) {
    const resultCountElement = document.getElementById("result-count");
    if (!resultCountElement) return;

    const totalVisible =
      count !== null ? count : this.articles.filter((a) => a.visible).length;
    const totalArticles = this.articles.length;

    let message = "";
    if (this.currentFilter === "all") {
      message = `${totalArticles} article${
        totalArticles > 1 ? "s" : ""
      } au total`;
    } else {
      message = `${totalVisible} article${
        totalVisible > 1 ? "s" : ""
      } dans la catégorie "${this.formatCategoryName(this.currentFilter)}"`;
    }

    resultCountElement.textContent = message;
  }

  announceFilterChange(category, count) {
    // Annonce pour les lecteurs d'écran
    const announcement =
      category === "all"
        ? `Tous les articles sont affichés. ${count} articles au total.`
        : `Filtrage par catégorie ${this.formatCategoryName(
            category
          )}. ${count} article${count > 1 ? "s" : ""} trouvé${
            count > 1 ? "s" : ""
          }.`;

    const announcer = document.getElementById("filter-announcer");
    if (announcer) {
      announcer.textContent = announcement;
    }
  }

  // Méthode pour réinitialiser le filtre (utile pour les tests)
  resetFilter() {
    const categorySelect = document.getElementById("category-filter");
    if (categorySelect) {
      categorySelect.value = "all";
      this.filterArticles("all");
    }
  }
}

// =============================================================================
// NAVIGATION EXISTANTE (optimisée)
// =============================================================================

class Navigation {
  constructor() {
    this.initExistingNavigation();
  }

  initExistingNavigation() {
    // Récupération des éléments de navigation existants
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav-principal");
    const backdrop = document.querySelector(".nav-backdrop");

    if (!navToggle || !nav || !backdrop) return;

    // Optimisation du code existant avec gestion d'erreurs
    this.setupMobileNavigation(navToggle, nav, backdrop);
    this.setupCarousel();
  }

  setupMobileNavigation(navToggle, nav, backdrop) {
    const focusableSel =
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let lastFocus;

    const openNav = () => {
      try {
        lastFocus = document.activeElement;
        nav.classList.add("is-open");
        backdrop.hidden = false;
        backdrop.classList.add("is-active");
        document.body.classList.add("no-scroll");
        navToggle.setAttribute("aria-expanded", "true");

        const first = nav.querySelector(focusableSel);
        if (first) first.focus();
      } catch (error) {
        console.error("Erreur lors de l'ouverture de la navigation:", error);
      }
    };

    const closeNav = () => {
      try {
        nav.classList.remove("is-open");
        backdrop.classList.remove("is-active");
        setTimeout(() => (backdrop.hidden = true), 300);
        document.body.classList.remove("no-scroll");
        navToggle.setAttribute("aria-expanded", "false");

        if (lastFocus) lastFocus.focus();
      } catch (error) {
        console.error("Erreur lors de la fermeture de la navigation:", error);
      }
    };

    const handleKeyboardNavigation = (e) => {
      if (!nav.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        closeNav();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = [...nav.querySelectorAll(focusableSel)];
        if (!focusableElements.length) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    // Événements
    navToggle.addEventListener("click", () => {
      nav.classList.contains("is-open") ? closeNav() : openNav();
    });

    backdrop.addEventListener("click", closeNav);
    window.addEventListener("keyup", handleKeyboardNavigation);
  }

  setupCarousel() {
    const track = document.getElementById("track");
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");

    if (!track || !prevBtn || !nextBtn) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -320, behavior });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: 320, behavior });
    });
  }
}

// =============================================================================
// INITIALISATION PRINCIPALE
// =============================================================================

class RunTogetherApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeComponents()
      );
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialisation des composants avec gestion d'erreurs
      this.components.navigation = new Navigation();

      // Initialisation conditionnelle selon la page
      if (document.getElementById("welcome-form")) {
        this.components.welcomeMessage = new WelcomeMessage();
      }

      if (document.querySelector(".article-toggle-btn")) {
        this.components.articleToggle = new ArticleToggle();
      }

      if (document.getElementById("category-filter")) {
        this.components.articleFilter = new ArticleFilter();
      }

      console.log(
        "RunTogether: Toutes les fonctionnalités ont été initialisées avec succès"
      );
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'application:", error);
    }
  }

  // Méthodes d'accès pour les tests
  getComponent(name) {
    return this.components[name];
  }

  // Méthode de nettoyage pour les tests
  destroy() {
    Object.values(this.components).forEach((component) => {
      if (component && typeof component.destroy === "function") {
        component.destroy();
      }
    });
    this.components = {};
  }
}

// =============================================================================
// DÉMARRAGE DE L'APPLICATION
// =============================================================================

// Variable globale pour accès dans les tests
window.RunTogetherApp = RunTogetherApp;

// Initialisation automatique
const app = new RunTogetherApp();

// Export pour les tests (si module)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    RunTogetherApp,
    WelcomeMessage,
    ArticleToggle,
    ArticleFilter,
    Navigation,
    sanitizeInput,
    validateInput,
    debounce,
  };
}
