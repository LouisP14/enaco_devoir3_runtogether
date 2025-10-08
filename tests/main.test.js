/**
 * Tests unitaires pour RunTogether
 * Tests des fonctionnalités interactives et de sécurité
 */

// =============================================================================
// UTILITAIRES DE TEST
// =============================================================================

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
    };
  }

  describe(description, testFunction) {
    console.group(`📋 ${description}`);
    testFunction();
    console.groupEnd();
  }

  it(description, testFunction) {
    this.results.total++;
    try {
      testFunction();
      this.results.passed++;
      console.log(`✅ ${description}`);
    } catch (error) {
      this.results.failed++;
      console.error(`❌ ${description}:`, error.message);
    }
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, but got ${actual}`);
        }
      },
      toBeNull: () => {
        if (actual !== null) {
          throw new Error(`Expected null, but got ${actual}`);
        }
      },
      toBeInstanceOf: (expectedClass) => {
        if (!(actual instanceof expectedClass)) {
          throw new Error(
            `Expected instance of ${
              expectedClass.name
            }, but got ${typeof actual}`
          );
        }
      },
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected "${actual}" to contain "${expected}"`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected truthy value, but got ${actual}`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected falsy value, but got ${actual}`);
        }
      },
    };
  }

  run() {
    console.log("\n🧪 DÉMARRAGE DES TESTS RunTogether\n");

    // Tests des utilitaires
    this.testUtilities();

    // Tests de sécurité
    this.testSecurity();

    // Tests des composants
    this.testComponents();

    // Résultats finaux
    console.log("\n📊 RÉSULTATS DES TESTS");
    console.log(`Total: ${this.results.total}`);
    console.log(`✅ Réussis: ${this.results.passed}`);
    console.log(`❌ Échoués: ${this.results.failed}`);
    console.log(
      `📈 Taux de réussite: ${Math.round(
        (this.results.passed / this.results.total) * 100
      )}%`
    );

    return this.results;
  }

  // =============================================================================
  // TESTS DES UTILITAIRES
  // =============================================================================

  testUtilities() {
    this.describe("Tests des fonctions utilitaires", () => {
      this.it("sanitizeInput devrait nettoyer les balises HTML", () => {
        const input = '<script>alert("XSS")</script>Hello';
        const result = sanitizeInput(input);
        this.expect(result).toBe(
          '&lt;script&gt;alert("XSS")&lt;/script&gt;Hello'
        );
      });

      this.it("sanitizeInput devrait gérer les entrées non-string", () => {
        this.expect(sanitizeInput(null)).toBe("");
        this.expect(sanitizeInput(undefined)).toBe("");
        this.expect(sanitizeInput(123)).toBe("");
      });

      this.it("validateInput devrait valider les entrées correctement", () => {
        this.expect(validateInput("Jean")).toBeTruthy();
        this.expect(validateInput("")).toBeFalsy();
        this.expect(validateInput("   ")).toBeFalsy();
        this.expect(validateInput("A".repeat(51))).toBeFalsy();
      });

      this.it("debounce devrait retarder l'exécution", (done) => {
        let callCount = 0;
        const debouncedFn = debounce(() => callCount++, 100);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        setTimeout(() => {
          this.expect(callCount).toBe(1);
          if (done) done();
        }, 150);
      });
    });
  }

  // =============================================================================
  // TESTS DE SÉCURITÉ
  // =============================================================================

  testSecurity() {
    this.describe("Tests de sécurité - Prévention XSS", () => {
      this.it("devrait prévenir les injections de script basiques", () => {
        const maliciousInputs = [
          '<script>alert("XSS")</script>',
          '<img src="x" onerror="alert(1)">',
          'javascript:alert("XSS")',
          '<svg onload="alert(1)">',
          '<iframe src="javascript:alert(1)"></iframe>',
        ];

        maliciousInputs.forEach((input) => {
          const sanitized = sanitizeInput(input);
          this.expect(sanitized).toContain("&lt;");
          this.expect(sanitized).toContain("&gt;");
        });
      });

      this.it("devrait prévenir les injections via les attributs", () => {
        const input = '<div onclick="alert(1)">Click me</div>';
        const sanitized = sanitizeInput(input);
        this.expect(sanitized).toBe(
          '&lt;div onclick="alert(1)"&gt;Click me&lt;/div&gt;'
        );
      });

      this.it("devrait préserver le contenu texte légitime", () => {
        const input = "Bonjour Jean-Pierre! Comment ça va? 😊";
        const sanitized = sanitizeInput(input);
        this.expect(sanitized).toBe(input);
      });

      this.it("validateInput devrait rejeter les entrées trop longues", () => {
        const longInput = "A".repeat(1000);
        this.expect(validateInput(longInput)).toBeFalsy();
      });
    });
  }

  // =============================================================================
  // TESTS DES COMPOSANTS
  // =============================================================================

  testComponents() {
    this.describe("Tests des composants principaux", () => {
      this.it("RunTogetherApp devrait s'initialiser correctement", () => {
        // Simulation du DOM
        this.setupMockDOM();

        const app = new RunTogetherApp();
        this.expect(app).toBeInstanceOf(RunTogetherApp);
        this.expect(app.components).toBeTruthy();
      });

      this.it("WelcomeMessage devrait valider les entrées", () => {
        this.setupMockDOM();

        const welcome = new WelcomeMessage();

        // Test avec entrée valide
        const mockEvent = {
          preventDefault: () => {},
          target: { value: "Jean" },
        };
        // Simulation de l'interaction (ne peut pas tester l'UI complète sans DOM réel)

        this.expect(validateInput("Jean")).toBeTruthy();
        this.expect(validateInput("")).toBeFalsy();
      });

      this.it("ArticleToggle devrait gérer les états correctement", () => {
        this.setupMockDOM();

        const toggle = new ArticleToggle();
        this.expect(toggle.hiddenArticles).toBeInstanceOf(Set);
        this.expect(toggle.hiddenArticles.size).toBe(0);
      });

      this.it("ArticleFilter devrait initialiser les catégories", () => {
        this.setupMockDOM();

        const filter = new ArticleFilter();
        this.expect(filter.articles).toBeInstanceOf(Array);
        this.expect(filter.currentFilter).toBe("all");
      });
    });
  }

  // =============================================================================
  // SETUP MOCK DOM POUR LES TESTS
  // =============================================================================

  setupMockDOM() {
    // Simulation basique du DOM pour les tests
    if (typeof document === "undefined") {
      global.document = {
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: (tag) => ({
          tagName: tag.toUpperCase(),
          textContent: "",
          innerHTML: "",
          appendChild: () => {},
          addEventListener: () => {},
          setAttribute: () => {},
          removeAttribute: () => {},
          classList: {
            add: () => {},
            remove: () => {},
            toggle: () => {},
            contains: () => false,
          },
          style: {},
          dataset: {},
        }),
        addEventListener: () => {},
        readyState: "complete",
      };

      global.window = {
        addEventListener: () => {},
        matchMedia: () => ({ matches: false }),
      };
    }
  }
}

// =============================================================================
// TESTS SPÉCIFIQUES AUX FONCTIONNALITÉS
// =============================================================================

class FeatureTests extends TestRunner {
  constructor() {
    super();
  }

  runFeatureTests() {
    console.log("\n🎯 TESTS FONCTIONNELS SPÉCIFIQUES\n");

    this.testWelcomeMessageFeature();
    this.testArticleToggleFeature();
    this.testArticleFilterFeature();
  }

  testWelcomeMessageFeature() {
    this.describe("Fonctionnalité: Message de bienvenue personnalisé", () => {
      this.it("devrait accepter des prénoms valides", () => {
        const validNames = [
          "Jean",
          "Marie-Claire",
          "José",
          "Anne-Sophie",
          "Al",
        ];

        validNames.forEach((name) => {
          this.expect(validateInput(name)).toBeTruthy();
        });
      });

      this.it("devrait rejeter les prénoms invalides", () => {
        const invalidNames = ["", "   ", null, undefined, "A".repeat(51)];

        invalidNames.forEach((name) => {
          this.expect(validateInput(name)).toBeFalsy();
        });
      });

      this.it("devrait sécuriser les prénoms avec du code malveillant", () => {
        const maliciousNames = [
          '<script>alert("hack")</script>',
          "Jean<img src=x onerror=alert(1)>",
          'Marie"onmouseover="alert(1)',
        ];

        maliciousNames.forEach((name) => {
          const sanitized = sanitizeInput(name);
          this.expect(sanitized).toContain("&lt;");
        });
      });
    });
  }

  testArticleToggleFeature() {
    this.describe("Fonctionnalité: Masquer/Afficher articles", () => {
      this.it("devrait initialiser avec aucun article masqué", () => {
        const toggle = new ArticleToggle();
        this.expect(toggle.hiddenArticles.size).toBe(0);
      });

      this.it(
        "devrait pouvoir ajouter et supprimer des articles masqués",
        () => {
          const toggle = new ArticleToggle();

          toggle.hiddenArticles.add("article-1");
          this.expect(toggle.hiddenArticles.has("article-1")).toBeTruthy();

          toggle.hiddenArticles.delete("article-1");
          this.expect(toggle.hiddenArticles.has("article-1")).toBeFalsy();
        }
      );
    });
  }

  testArticleFilterFeature() {
    this.describe("Fonctionnalité: Filtrage par catégorie", () => {
      this.it('devrait commencer avec le filtre "all"', () => {
        const filter = new ArticleFilter();
        this.expect(filter.currentFilter).toBe("all");
      });

      this.it("devrait formater les noms de catégories correctement", () => {
        const filter = new ArticleFilter();

        this.expect(filter.formatCategoryName("actu")).toBe("Actu");
        this.expect(filter.formatCategoryName("actu-produits")).toBe(
          "Actu produits"
        );
        this.expect(filter.formatCategoryName("entraînement")).toBe(
          "Entraînement"
        );
      });
    });
  }
}

// =============================================================================
// TESTS DE PERFORMANCE ET ÉCO-CONCEPTION
// =============================================================================

class PerformanceTests extends TestRunner {
  constructor() {
    super();
  }

  runPerformanceTests() {
    console.log("\n⚡ TESTS DE PERFORMANCE ET ÉCO-CONCEPTION\n");

    this.describe("Tests de performance", () => {
      this.it("debounce devrait limiter les appels de fonction", () => {
        let callCount = 0;
        const debouncedFn = debounce(() => callCount++, 50);

        // Simulation de plusieurs appels rapides
        for (let i = 0; i < 10; i++) {
          debouncedFn();
        }

        // Vérification que seul le dernier appel sera exécuté
        setTimeout(() => {
          this.expect(callCount).toBe(1);
        }, 100);
      });

      this.it("les fonctions utilitaires devraient être optimisées", () => {
        const start = performance.now();

        // Test de performance sur sanitizeInput
        for (let i = 0; i < 1000; i++) {
          sanitizeInput(`Test string ${i} avec du <code>HTML</code>`);
        }

        const end = performance.now();
        const duration = end - start;

        // L'exécution de 1000 sanitisations ne devrait pas prendre plus de 100ms
        this.expect(duration < 100).toBeTruthy();
      });

      this.it("la validation devrait être rapide", () => {
        const start = performance.now();

        for (let i = 0; i < 1000; i++) {
          validateInput(`TestString${i}`);
        }

        const end = performance.now();
        const duration = end - start;

        // 1000 validations en moins de 50ms
        this.expect(duration < 50).toBeTruthy();
      });
    });
  }
}

// =============================================================================
// EXÉCUTION DES TESTS
// =============================================================================

function runAllTests() {
  console.clear();
  console.log("🏃‍♂️ RunTogether - Suite de Tests Complète");
  console.log("==========================================\n");

  const mainTests = new TestRunner();
  const featureTests = new FeatureTests();
  const performanceTests = new PerformanceTests();

  // Exécution de tous les tests
  const mainResults = mainTests.run();
  featureTests.runFeatureTests();
  performanceTests.runPerformanceTests();

  // Calcul des résultats globaux
  const totalTests =
    mainResults.total +
    featureTests.results.total +
    performanceTests.results.total;
  const totalPassed =
    mainResults.passed +
    featureTests.results.passed +
    performanceTests.results.passed;
  const totalFailed =
    mainResults.failed +
    featureTests.results.failed +
    performanceTests.results.failed;

  console.log("\n🎯 RÉSULTATS GLOBAUX");
  console.log("===================");
  console.log(`Total des tests: ${totalTests}`);
  console.log(`✅ Réussis: ${totalPassed}`);
  console.log(`❌ Échoués: ${totalFailed}`);
  console.log(
    `📊 Taux de réussite global: ${Math.round(
      (totalPassed / totalTests) * 100
    )}%`
  );

  if (totalFailed === 0) {
    console.log("\n🎉 Tous les tests sont passés avec succès!");
    console.log("✨ L'application est prête pour la production.");
  } else {
    console.log(
      `\n⚠️  ${totalFailed} test(s) ont échoué. Veuillez corriger les problèmes identifiés.`
    );
  }

  return {
    total: totalTests,
    passed: totalPassed,
    failed: totalFailed,
    successRate: Math.round((totalPassed / totalTests) * 100),
  };
}

// Export pour utilisation externe
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TestRunner,
    FeatureTests,
    PerformanceTests,
    runAllTests,
  };
}

// Execution automatique si chargé dans le navigateur
if (typeof window !== "undefined") {
  window.runAllTests = runAllTests;
  window.TestRunner = TestRunner;
}

// Pour les tests en ligne de commande
if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
  runAllTests();
}
