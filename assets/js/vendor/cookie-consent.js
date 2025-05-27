/**
 * Bonobo Bar & More - Cookie Consent Module
 * Complete GDPR-compliant cookie consent system
 *
 * Features:
 * - GDPR and CCPA compliant cookie consent
 * - Granular consent categories (necessary, analytics, marketing)
 * - Consent banner with customizable messaging
 * - Persistent consent storage with expiration
 * - Dynamic script loading based on consent
 * - Consent withdrawal and management
 * - Accessibility-compliant interface
 * - Multi-language support integration
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const CookieConsent = {
    // Configuration
    config: {
      // Storage settings
      storageKey: "bonobo-cookie-consent",
      consentExpiry: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds

      // UI settings
      bannerSelector: "#cookie-consent",
      showDelay: 1000,
      hideDelay: 300,

      // Consent categories
      categories: {
        necessary: {
          name: "necessary",
          required: true,
          enabled: true,
        },
        analytics: {
          name: "analytics",
          required: false,
          enabled: false,
        },
        marketing: {
          name: "marketing",
          required: false,
          enabled: false,
        },
        preferences: {
          name: "preferences",
          required: false,
          enabled: false,
        },
      },

      // Scripts to load based on consent
      scripts: {
        analytics: [
          {
            src: "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID",
            type: "text/javascript",
            async: true,
          },
        ],
        marketing: [
          {
            src: "https://connect.facebook.net/en_US/fbevents.js",
            type: "text/javascript",
            async: true,
          },
        ],
      },
    },

    // Current state
    state: {
      consent: null,
      isVisible: false,
      isInitialized: false,
      hasShown: false,
      consentGiven: false,
      consentTimestamp: null,
    },

    // DOM elements
    elements: {
      banner: null,
      acceptButton: null,
      declineButton: null,
      settingsButton: null,
      modal: null,
      categoryToggles: null,
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize cookie consent
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Cache DOM elements
        cacheDOMElements();

        // Load existing consent
        loadConsentState();

        // Check if consent is needed
        if (needsConsent()) {
          // Setup UI
          setupConsentBanner();

          // Show banner after delay
          setTimeout(() => {
            showConsentBanner();
          }, CookieConsent.config.showDelay);
        } else {
          // Apply existing consent
          applyConsent();
        }

        // Setup event listeners
        setupEventListeners();

        CookieConsent.state.isInitialized = true;

        console.log("Cookie consent initialized:", CookieConsent.state.consent);
        resolve();
      } catch (error) {
        console.error("Cookie consent initialization failed:", error);
        resolve();
      }
    });
  }

  /**
   * Cache frequently used DOM elements
   */
  function cacheDOMElements() {
    CookieConsent.elements.banner = document.querySelector(
      CookieConsent.config.bannerSelector
    );

    if (CookieConsent.elements.banner) {
      CookieConsent.elements.acceptButton =
        CookieConsent.elements.banner.querySelector(
          ".cookie-consent__button--accept"
        );
      CookieConsent.elements.declineButton =
        CookieConsent.elements.banner.querySelector(
          ".cookie-consent__button--decline"
        );
      CookieConsent.elements.settingsButton =
        CookieConsent.elements.banner.querySelector(
          ".cookie-consent__button--settings"
        );
    }
  }

  /**
   * Load existing consent state from storage
   */
  function loadConsentState() {
    try {
      const storedConsent = localStorage.getItem(
        CookieConsent.config.storageKey
      );

      if (storedConsent) {
        const consentData = JSON.parse(storedConsent);

        // Check if consent is still valid
        if (isConsentValid(consentData)) {
          CookieConsent.state.consent = consentData.consent;
          CookieConsent.state.consentGiven = true;
          CookieConsent.state.consentTimestamp = consentData.timestamp;
        } else {
          // Consent expired, remove it
          localStorage.removeItem(CookieConsent.config.storageKey);
        }
      }
    } catch (error) {
      console.warn("Failed to load consent state:", error);
    }
  }

  /**
   * Check if consent is still valid
   */
  function isConsentValid(consentData) {
    if (!consentData || !consentData.timestamp) {
      return false;
    }

    const now = Date.now();
    const consentAge = now - consentData.timestamp;

    return consentAge < CookieConsent.config.consentExpiry;
  }

  /**
   * Check if consent is needed
   */
  function needsConsent() {
    return !CookieConsent.state.consentGiven;
  }

  /**
   * Setup consent banner UI
   */
  function setupConsentBanner() {
    if (!CookieConsent.elements.banner) {
      createConsentBanner();
    }

    // Ensure banner is accessible
    CookieConsent.elements.banner.setAttribute("role", "dialog");
    CookieConsent.elements.banner.setAttribute("aria-label", "Cookie consent");
    CookieConsent.elements.banner.setAttribute("aria-hidden", "true");
  }

  /**
   * Create consent banner if it doesn't exist
   */
  function createConsentBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-consent";
    banner.className = "cookie-consent";
    banner.setAttribute("aria-hidden", "true");

    banner.innerHTML = `
        <div class="cookie-consent__content">
          <p class="cookie-consent__text" data-translate="cookie.message">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div class="cookie-consent__actions">
            <button class="cookie-consent__button cookie-consent__button--accept" data-translate="cookie.accept">
              Accept All
            </button>
            <button class="cookie-consent__button cookie-consent__button--decline" data-translate="cookie.decline">
              Decline
            </button>
            <button class="cookie-consent__button cookie-consent__button--settings" data-translate="cookie.settings">
              Settings
            </button>
          </div>
        </div>
      `;

    document.body.appendChild(banner);

    // Update element references
    CookieConsent.elements.banner = banner;
    CookieConsent.elements.acceptButton = banner.querySelector(
      ".cookie-consent__button--accept"
    );
    CookieConsent.elements.declineButton = banner.querySelector(
      ".cookie-consent__button--decline"
    );
    CookieConsent.elements.settingsButton = banner.querySelector(
      ".cookie-consent__button--settings"
    );
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Accept button
    if (CookieConsent.elements.acceptButton) {
      CookieConsent.elements.acceptButton.addEventListener(
        "click",
        handleAcceptAll
      );
    }

    // Decline button
    if (CookieConsent.elements.declineButton) {
      CookieConsent.elements.declineButton.addEventListener(
        "click",
        handleDeclineAll
      );
    }

    // Settings button
    if (CookieConsent.elements.settingsButton) {
      CookieConsent.elements.settingsButton.addEventListener(
        "click",
        handleShowSettings
      );
    }

    // Keyboard navigation
    if (CookieConsent.elements.banner) {
      CookieConsent.elements.banner.addEventListener("keydown", handleKeyDown);
    }

    // Listen for language changes
    document.addEventListener("language:change", handleLanguageChange);
  }

  // ================================
  // EVENT HANDLERS
  // ================================

  /**
   * Handle accept all cookies
   */
  function handleAcceptAll(event) {
    event.preventDefault();

    const consent = {};
    Object.keys(CookieConsent.config.categories).forEach((category) => {
      consent[category] = true;
    });

    giveConsent(consent);
    hideConsentBanner();
  }

  /**
   * Handle decline all non-necessary cookies
   */
  function handleDeclineAll(event) {
    event.preventDefault();

    const consent = {};
    Object.keys(CookieConsent.config.categories).forEach((category) => {
      consent[category] = CookieConsent.config.categories[category].required;
    });

    giveConsent(consent);
    hideConsentBanner();
  }

  /**
   * Handle show settings modal
   */
  function handleShowSettings(event) {
    event.preventDefault();
    showSettingsModal();
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleDeclineAll(event);
    }
  }

  /**
   * Handle language changes
   */
  function handleLanguageChange() {
    // Update consent banner text if visible
    if (CookieConsent.state.isVisible) {
      updateConsentText();
    }
  }

  // ================================
  // CONSENT MANAGEMENT
  // ================================

  /**
   * Give consent with specified preferences
   */
  function giveConsent(consentPreferences) {
    const consentData = {
      consent: consentPreferences,
      timestamp: Date.now(),
      version: "1.0",
    };

    // Save to storage
    try {
      localStorage.setItem(
        CookieConsent.config.storageKey,
        JSON.stringify(consentData)
      );
    } catch (error) {
      console.warn("Failed to save consent:", error);
    }

    // Update state
    CookieConsent.state.consent = consentPreferences;
    CookieConsent.state.consentGiven = true;
    CookieConsent.state.consentTimestamp = consentData.timestamp;

    // Apply consent
    applyConsent();

    // Dispatch event
    document.dispatchEvent(
      new CustomEvent("consent:given", {
        detail: { consent: consentPreferences },
      })
    );
  }

  /**
   * Apply consent preferences
   */
  function applyConsent() {
    if (!CookieConsent.state.consent) {
      return;
    }

    const consent = CookieConsent.state.consent;

    // Load scripts based on consent
    Object.keys(consent).forEach((category) => {
      if (consent[category] && CookieConsent.config.scripts[category]) {
        loadCategoryScripts(category);
      }
    });

    // Set consent classes on body
    updateBodyClasses(consent);

    // Initialize category-specific functionality
    initializeCategoryFeatures(consent);
  }

  /**
   * Load scripts for specific category
   */
  function loadCategoryScripts(category) {
    const scripts = CookieConsent.config.scripts[category];
    if (!scripts) return;

    scripts.forEach((scriptConfig) => {
      const script = document.createElement("script");

      Object.keys(scriptConfig).forEach((attr) => {
        if (attr === "content") {
          script.textContent = scriptConfig[attr];
        } else {
          script.setAttribute(attr, scriptConfig[attr]);
        }
      });

      document.head.appendChild(script);
    });
  }

  /**
   * Update body classes based on consent
   */
  function updateBodyClasses(consent) {
    Object.keys(consent).forEach((category) => {
      const className = `consent-${category}`;

      if (consent[category]) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    });
  }

  /**
   * Initialize category-specific features
   */
  function initializeCategoryFeatures(consent) {
    // Analytics
    if (consent.analytics) {
      initializeAnalytics();
    }

    // Marketing
    if (consent.marketing) {
      initializeMarketing();
    }

    // Preferences
    if (consent.preferences) {
      initializePreferences();
    }
  }

  /**
   * Initialize analytics features
   */
  function initializeAnalytics() {
    // Initialize Google Analytics or other analytics tools
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  /**
   * Initialize marketing features
   */
  function initializeMarketing() {
    // Initialize marketing pixels, social media widgets, etc.
    if (typeof fbq === "function") {
      fbq("consent", "grant");
    }
  }

  /**
   * Initialize preferences features
   */
  function initializePreferences() {
    // Initialize preference-based features
  }

  // ================================
  // UI FUNCTIONS
  // ================================

  /**
   * Show consent banner
   */
  function showConsentBanner() {
    if (!CookieConsent.elements.banner || CookieConsent.state.isVisible) {
      return;
    }

    CookieConsent.state.isVisible = true;
    CookieConsent.state.hasShown = true;

    CookieConsent.elements.banner.setAttribute("aria-hidden", "false");
    CookieConsent.elements.banner.style.display = "block";

    // Focus first button for accessibility
    const firstButton = CookieConsent.elements.banner.querySelector("button");
    if (firstButton) {
      setTimeout(() => {
        firstButton.focus();
      }, 100);
    }

    // Add body class
    document.body.classList.add("cookie-consent-visible");

    // Dispatch event
    document.dispatchEvent(new CustomEvent("consent:shown"));
  }

  /**
   * Hide consent banner
   */
  function hideConsentBanner() {
    if (!CookieConsent.elements.banner || !CookieConsent.state.isVisible) {
      return;
    }

    CookieConsent.state.isVisible = false;

    CookieConsent.elements.banner.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      CookieConsent.elements.banner.style.display = "none";
      document.body.classList.remove("cookie-consent-visible");
    }, CookieConsent.config.hideDelay);

    // Dispatch event
    document.dispatchEvent(new CustomEvent("consent:hidden"));
  }

  /**
   * Show settings modal
   */
  function showSettingsModal() {
    // Create modal if it doesn't exist
    if (!CookieConsent.elements.modal) {
      createSettingsModal();
    }

    CookieConsent.elements.modal.style.display = "block";
    CookieConsent.elements.modal.setAttribute("aria-hidden", "false");

    // Focus first interactive element
    const firstInput =
      CookieConsent.elements.modal.querySelector("input, button");
    if (firstInput) {
      firstInput.focus();
    }
  }

  /**
   * Create settings modal
   */
  function createSettingsModal() {
    const modal = document.createElement("div");
    modal.className = "cookie-settings-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Cookie Settings");
    modal.setAttribute("aria-hidden", "true");

    const categoriesHTML = Object.keys(CookieConsent.config.categories)
      .map((categoryKey) => {
        const category = CookieConsent.config.categories[categoryKey];
        const checked =
          CookieConsent.state.consent?.[categoryKey] || category.required;
        const disabled = category.required ? "disabled" : "";

        return `
          <div class="cookie-category">
            <label class="cookie-category__label">
              <input 
                type="checkbox" 
                name="${categoryKey}" 
                ${checked ? "checked" : ""} 
                ${disabled}
                class="cookie-category__toggle"
              >
              <span class="cookie-category__name" data-translate="cookie.category.${categoryKey}">
                ${category.name}
              </span>
            </label>
            <p class="cookie-category__description" data-translate="cookie.category.${categoryKey}.description">
              Description for ${category.name} cookies
            </p>
          </div>
        `;
      })
      .join("");

    modal.innerHTML = `
        <div class="cookie-settings-modal__backdrop"></div>
        <div class="cookie-settings-modal__content">
          <header class="cookie-settings-modal__header">
            <h2 data-translate="cookie.settings.title">Cookie Settings</h2>
            <button class="cookie-settings-modal__close" aria-label="Close">×</button>
          </header>
          <div class="cookie-settings-modal__body">
            <p data-translate="cookie.settings.description">
              Choose which cookies you want to allow. You can change these settings at any time.
            </p>
            <div class="cookie-categories">
              ${categoriesHTML}
            </div>
          </div>
          <footer class="cookie-settings-modal__footer">
            <button class="cookie-settings-modal__button cookie-settings-modal__button--save" data-translate="cookie.settings.save">
              Save Settings
            </button>
            <button class="cookie-settings-modal__button cookie-settings-modal__button--cancel" data-translate="cookie.settings.cancel">
              Cancel
            </button>
          </footer>
        </div>
      `;

    document.body.appendChild(modal);

    // Setup modal event listeners
    modal
      .querySelector(".cookie-settings-modal__close")
      .addEventListener("click", hideSettingsModal);
    modal
      .querySelector(".cookie-settings-modal__backdrop")
      .addEventListener("click", hideSettingsModal);
    modal
      .querySelector(".cookie-settings-modal__button--save")
      .addEventListener("click", saveSettings);
    modal
      .querySelector(".cookie-settings-modal__button--cancel")
      .addEventListener("click", hideSettingsModal);

    CookieConsent.elements.modal = modal;
    CookieConsent.elements.categoryToggles = modal.querySelectorAll(
      ".cookie-category__toggle"
    );
  }

  /**
   * Hide settings modal
   */
  function hideSettingsModal() {
    if (CookieConsent.elements.modal) {
      CookieConsent.elements.modal.style.display = "none";
      CookieConsent.elements.modal.setAttribute("aria-hidden", "true");
    }
  }

  /**
   * Save settings from modal
   */
  function saveSettings() {
    const consent = {};

    CookieConsent.elements.categoryToggles.forEach((toggle) => {
      consent[toggle.name] = toggle.checked;
    });

    giveConsent(consent);
    hideSettingsModal();
    hideConsentBanner();
  }

  /**
   * Update consent text (for language changes)
   */
  function updateConsentText() {
    // This would integrate with the language switcher to update text
    // For now, it's a placeholder
  }

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Get current consent state
   */
  function getConsent() {
    return CookieConsent.state.consent
      ? { ...CookieConsent.state.consent }
      : null;
  }

  /**
   * Check if specific category is consented
   */
  function hasConsent(category) {
    return CookieConsent.state.consent?.[category] || false;
  }

  /**
   * Withdraw consent (show banner again)
   */
  function withdrawConsent() {
    localStorage.removeItem(CookieConsent.config.storageKey);

    CookieConsent.state.consent = null;
    CookieConsent.state.consentGiven = false;
    CookieConsent.state.consentTimestamp = null;

    // Remove body classes
    Object.keys(CookieConsent.config.categories).forEach((category) => {
      document.body.classList.remove(`consent-${category}`);
    });

    // Show banner again
    if (CookieConsent.state.isInitialized) {
      showConsentBanner();
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent("consent:withdrawn"));
  }

  /**
   * Show consent banner manually
   */
  function showBanner() {
    showConsentBanner();
  }

  /**
   * Show settings modal manually
   */
  function showSettings() {
    showSettingsModal();
  }

  /**
   * Check if consent is required by law (simplified check)
   */
  function isConsentRequired() {
    // This is a simplified check - in reality, you'd check user's location
    // For now, assume consent is always required
    return true;
  }

  // ================================
  // INITIALIZATION AND EXPORT
  // ================================

  // Create public API
  const publicAPI = {
    init,
    getConsent,
    hasConsent,
    withdrawConsent,
    showBanner,
    showSettings,
    isConsentRequired,

    // State access (read-only)
    getState: () => ({ ...CookieConsent.state }),
    getConfig: () => ({ ...CookieConsent.config }),
  };

  // Export to window
  window.cookieConsent = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
