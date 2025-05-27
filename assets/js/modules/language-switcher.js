/**
 * Bonobo Bar & More - Language Switcher Module
 * Complete bilingual English/Greek system with dynamic content loading
 *
 * Features:
 * - Dynamic content translation with JSON files
 * - Smooth language switching with fallbacks
 * - localStorage persistence across sessions
 * - Accessible dropdown with keyboard navigation
 * - Performance-optimized translation caching
 * - SEO-friendly language attributes
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const LanguageSwitch = {
    // Configuration
    config: {
      storageKey: "bonobo-language",
      attribute: "data-lang",
      toggleSelector: "[data-language-toggle]",
      optionSelector: "[data-lang]",
      translateSelector: "[data-translate]",
      currentLangSelector: "[data-current-lang]",
      fallbackLanguage: "en",
      translationPath: "content/translations/",
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
    },

    // Current state
    state: {
      currentLanguage: "en",
      availableLanguages: ["en", "gr"],
      isLoading: false,
      isDropdownOpen: false,
      translationsCache: new Map(),
      lastCacheUpdate: null,
    },

    // DOM elements
    elements: {
      toggleButton: null,
      dropdown: null,
      options: null,
      currentLangDisplay: null,
      translateElements: null,
    },

    // Language definitions
    languages: {
      en: {
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇬🇧",
        dir: "ltr",
        htmlLang: "en-US",
      },
      gr: {
        code: "gr",
        name: "Greek",
        nativeName: "Ελληνικά",
        flag: "🇬🇷",
        dir: "ltr",
        htmlLang: "el-GR",
      },
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize language switcher
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Cache DOM elements
        cacheDOMElements();

        // Load saved language preference
        loadLanguagePreference();

        // Setup event listeners
        setupEventListeners();

        // Load initial translations
        loadTranslations(LanguageSwitch.state.currentLanguage)
          .then(() => {
            // Apply initial language
            applyLanguage(LanguageSwitch.state.currentLanguage, false);

            // Update UI
            updateLanguageUI();

            console.log(
              "Language switcher initialized:",
              LanguageSwitch.state.currentLanguage
            );
            resolve();
          })
          .catch((error) => {
            console.error("Failed to load initial translations:", error);
            // Fallback to default language without translations
            LanguageSwitch.state.currentLanguage =
              LanguageSwitch.config.fallbackLanguage;
            applyLanguage(LanguageSwitch.state.currentLanguage, false);
            updateLanguageUI();
            resolve();
          });
      } catch (error) {
        console.error("Language switcher initialization failed:", error);
        resolve();
      }
    });
  }

  /**
   * Cache frequently used DOM elements
   */
  function cacheDOMElements() {
    LanguageSwitch.elements.toggleButton = document.querySelector(
      LanguageSwitch.config.toggleSelector
    );
    LanguageSwitch.elements.dropdown = document.querySelector(
      ".language-switcher__menu"
    );
    LanguageSwitch.elements.options = document.querySelectorAll(
      LanguageSwitch.config.optionSelector
    );
    LanguageSwitch.elements.currentLangDisplay = document.querySelector(
      LanguageSwitch.config.currentLangSelector
    );
    LanguageSwitch.elements.translateElements = document.querySelectorAll(
      LanguageSwitch.config.translateSelector
    );
  }

  /**
   * Load language preference from storage or default
   */
  function loadLanguagePreference() {
    try {
      const savedLanguage = localStorage.getItem(
        LanguageSwitch.config.storageKey
      );
      const bodyLang = document.body.getAttribute(
        LanguageSwitch.config.attribute
      );
      const browserLanguage = getBrowserLanguage();

      if (savedLanguage && LanguageSwitch.languages[savedLanguage]) {
        LanguageSwitch.state.currentLanguage = savedLanguage;
      } else if (bodyLang && LanguageSwitch.languages[bodyLang]) {
        LanguageSwitch.state.currentLanguage = bodyLang;
      } else if (browserLanguage && LanguageSwitch.languages[browserLanguage]) {
        LanguageSwitch.state.currentLanguage = browserLanguage;
      } else {
        LanguageSwitch.state.currentLanguage =
          LanguageSwitch.config.fallbackLanguage;
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error);
      LanguageSwitch.state.currentLanguage =
        LanguageSwitch.config.fallbackLanguage;
    }
  }

  /**
   * Get browser language preference
   */
  function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (!browserLang) return null;

    // Map browser language codes to our language codes
    const langMap = {
      en: "en",
      "en-US": "en",
      "en-GB": "en",
      el: "gr",
      "el-GR": "gr",
      gr: "gr",
    };

    return langMap[browserLang] || langMap[browserLang.split("-")[0]];
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Toggle button
    if (LanguageSwitch.elements.toggleButton) {
      LanguageSwitch.elements.toggleButton.addEventListener(
        "click",
        handleToggleClick
      );
      LanguageSwitch.elements.toggleButton.addEventListener(
        "keydown",
        handleToggleKeydown
      );
    }

    // Language options
    LanguageSwitch.elements.options.forEach((option) => {
      option.addEventListener("click", handleOptionClick);
      option.addEventListener("keydown", handleOptionKeydown);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", handleDocumentClick);

    // Listen for app events
    document.addEventListener(
      "app:languagechange",
      handleExternalLanguageChange
    );

    // Handle page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }

  // ================================
  // EVENT HANDLERS
  // ================================

  /**
   * Handle toggle button click
   */
  function handleToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleDropdown();
  }

  /**
   * Handle toggle button keyboard interaction
   */
  function handleToggleKeydown(event) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        toggleDropdown();
        break;
      case "ArrowDown":
        event.preventDefault();
        openDropdown();
        focusFirstOption();
        break;
      case "Escape":
        event.preventDefault();
        closeDropdown();
        break;
    }
  }

  /**
   * Handle language option click
   */
  function handleOptionClick(event) {
    event.preventDefault();
    const languageCode = event.currentTarget.getAttribute("data-lang");
    if (languageCode) {
      setLanguage(languageCode);
      closeDropdown();
    }
  }

  /**
   * Handle language option keyboard interaction
   */
  function handleOptionKeydown(event) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        const languageCode = event.currentTarget.getAttribute("data-lang");
        if (languageCode) {
          setLanguage(languageCode);
          closeDropdown();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        focusNextOption(event.currentTarget);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusPreviousOption(event.currentTarget);
        break;
      case "Escape":
        event.preventDefault();
        closeDropdown();
        LanguageSwitch.elements.toggleButton?.focus();
        break;
    }
  }

  /**
   * Handle clicks outside dropdown
   */
  function handleDocumentClick(event) {
    const languageSwitcher = event.target.closest(".language-switcher");
    if (!languageSwitcher && LanguageSwitch.state.isDropdownOpen) {
      closeDropdown();
    }
  }

  /**
   * Handle external language change requests
   */
  function handleExternalLanguageChange(event) {
    if (
      event.detail &&
      event.detail.language &&
      LanguageSwitch.languages[event.detail.language]
    ) {
      setLanguage(event.detail.language);
    }
  }

  /**
   * Handle page visibility changes
   */
  function handleVisibilityChange() {
    if (document.hidden && LanguageSwitch.state.isDropdownOpen) {
      closeDropdown();
    }
  }

  // ================================
  // DROPDOWN MANAGEMENT
  // ================================

  /**
   * Toggle dropdown visibility
   */
  function toggleDropdown() {
    if (LanguageSwitch.state.isDropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Open dropdown
   */
  function openDropdown() {
    if (LanguageSwitch.state.isDropdownOpen) return;

    LanguageSwitch.state.isDropdownOpen = true;

    if (LanguageSwitch.elements.toggleButton) {
      LanguageSwitch.elements.toggleButton.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent("language:dropdownopen"));
  }

  /**
   * Close dropdown
   */
  function closeDropdown() {
    if (!LanguageSwitch.state.isDropdownOpen) return;

    LanguageSwitch.state.isDropdownOpen = false;

    if (LanguageSwitch.elements.toggleButton) {
      LanguageSwitch.elements.toggleButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent("language:dropdownclose"));
  }

  /**
   * Focus first option in dropdown
   */
  function focusFirstOption() {
    const firstOption = LanguageSwitch.elements.options[0];
    if (firstOption) {
      firstOption.focus();
    }
  }

  /**
   * Focus next option in dropdown
   */
  function focusNextOption(currentOption) {
    const options = Array.from(LanguageSwitch.elements.options);
    const currentIndex = options.indexOf(currentOption);
    const nextIndex = (currentIndex + 1) % options.length;
    options[nextIndex].focus();
  }

  /**
   * Focus previous option in dropdown
   */
  function focusPreviousOption(currentOption) {
    const options = Array.from(LanguageSwitch.elements.options);
    const currentIndex = options.indexOf(currentOption);
    const previousIndex =
      currentIndex === 0 ? options.length - 1 : currentIndex - 1;
    options[previousIndex].focus();
  }

  // ================================
  // LANGUAGE MANAGEMENT
  // ================================

  /**
   * Set specific language
   */
  function setLanguage(languageCode, save = true) {
    if (!LanguageSwitch.languages[languageCode]) {
      console.warn("Unknown language:", languageCode);
      return Promise.reject(new Error("Unknown language"));
    }

    if (LanguageSwitch.state.isLoading) {
      return Promise.reject(new Error("Language change in progress"));
    }

    const previousLanguage = LanguageSwitch.state.currentLanguage;

    if (previousLanguage === languageCode) {
      return Promise.resolve(); // No change needed
    }

    LanguageSwitch.state.isLoading = true;

    return loadTranslations(languageCode)
      .then(() => {
        LanguageSwitch.state.currentLanguage = languageCode;

        // Apply language
        applyLanguage(languageCode, true);

        // Save preference
        if (save) {
          saveLanguagePreference(languageCode);
        }

        // Update UI
        updateLanguageUI();

        // Dispatch language change event
        document.dispatchEvent(
          new CustomEvent("language:change", {
            detail: {
              language: languageCode,
              previousLanguage: previousLanguage,
              isUserInitiated: save,
            },
          })
        );

        LanguageSwitch.state.isLoading = false;
      })
      .catch((error) => {
        console.error("Failed to change language:", error);
        LanguageSwitch.state.isLoading = false;
        throw error;
      });
  }

  /**
   * Apply language to document
   */
  function applyLanguage(languageCode, updateContent = true) {
    const language = LanguageSwitch.languages[languageCode];
    if (!language) return;

    // Update document attributes
    document.documentElement.lang = language.htmlLang;
    document.documentElement.dir = language.dir;
    document.body.setAttribute(LanguageSwitch.config.attribute, languageCode);

    // Update meta tags
    updateMetaTags(language);

    // Update content if translations are available
    if (
      updateContent &&
      LanguageSwitch.state.translationsCache.has(languageCode)
    ) {
      updateTranslatedContent(languageCode);
    }
  }

  /**
   * Update meta tags for SEO
   */
  function updateMetaTags(language) {
    // Update or create alternate language links
    updateAlternateLanguageLinks();

    // Update Open Graph locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.content = language.htmlLang.replace("-", "_");
    }
  }

  /**
   * Update alternate language links for SEO
   */
  function updateAlternateLanguageLinks() {
    // Remove existing alternate links
    const existingLinks = document.querySelectorAll(
      'link[rel="alternate"][hreflang]'
    );
    existingLinks.forEach((link) => link.remove());

    // Add new alternate links
    const currentUrl = window.location.href.split("?")[0].split("#")[0];

    Object.values(LanguageSwitch.languages).forEach((lang) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang.htmlLang;
      link.href = `${currentUrl}?lang=${lang.code}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Load translations from JSON file
   */
  function loadTranslations(languageCode) {
    // Check cache first
    if (LanguageSwitch.state.translationsCache.has(languageCode)) {
      const cached = LanguageSwitch.state.translationsCache.get(languageCode);

      // Check if cache is still valid
      if (Date.now() - cached.timestamp < LanguageSwitch.config.cacheExpiry) {
        return Promise.resolve(cached.data);
      }
    }

    const translationUrl = `${LanguageSwitch.config.translationPath}${languageCode}.json`;

    return fetch(translationUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((translations) => {
        // Cache translations
        LanguageSwitch.state.translationsCache.set(languageCode, {
          data: translations,
          timestamp: Date.now(),
        });

        return translations;
      })
      .catch((error) => {
        console.warn(`Failed to load translations for ${languageCode}:`, error);

        // Return empty translations object as fallback
        const fallbackTranslations = {};
        LanguageSwitch.state.translationsCache.set(languageCode, {
          data: fallbackTranslations,
          timestamp: Date.now(),
        });

        return fallbackTranslations;
      });
  }

  /**
   * Update translated content on page
   */
  function updateTranslatedContent(languageCode) {
    const translations =
      LanguageSwitch.state.translationsCache.get(languageCode)?.data;
    if (!translations) return;

    // Update all elements with data-translate attribute
    const elementsToTranslate = document.querySelectorAll(
      LanguageSwitch.config.translateSelector
    );

    elementsToTranslate.forEach((element) => {
      const translationKey = element.getAttribute("data-translate");
      const translatedText = getNestedTranslation(translations, translationKey);

      if (translatedText) {
        // Preserve HTML structure if element contains HTML
        if (element.innerHTML.includes("<")) {
          // For elements with HTML, only update text nodes
          updateTextNodes(element, translatedText);
        } else {
          element.textContent = translatedText;
        }
      }
    });
  }

  /**
   * Get nested translation from dot notation key
   */
  function getNestedTranslation(translations, key) {
    return key.split(".").reduce((obj, path) => {
      return obj && obj[path] !== undefined ? obj[path] : null;
    }, translations);
  }

  /**
   * Update text nodes while preserving HTML structure
   */
  function updateTextNodes(element, newText) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) {
        textNodes.push(node);
      }
    }

    if (textNodes.length === 1) {
      textNodes[0].nodeValue = newText;
    }
  }

  /**
   * Save language preference to localStorage
   */
  function saveLanguagePreference(languageCode) {
    try {
      localStorage.setItem(LanguageSwitch.config.storageKey, languageCode);
    } catch (error) {
      console.warn("Could not save language preference:", error);
    }
  }

  /**
   * Update language switcher UI
   */
  function updateLanguageUI() {
    const currentLanguage =
      LanguageSwitch.languages[LanguageSwitch.state.currentLanguage];

    // Update current language display
    if (LanguageSwitch.elements.currentLangDisplay) {
      LanguageSwitch.elements.currentLangDisplay.textContent =
        currentLanguage.code.toUpperCase();
    }

    // Update option states
    LanguageSwitch.elements.options.forEach((option) => {
      const langCode = option.getAttribute("data-lang");
      const isActive = langCode === LanguageSwitch.state.currentLanguage;

      option.setAttribute("aria-pressed", isActive ? "true" : "false");

      if (isActive) {
        option.classList.add("language-switcher__option--active");
      } else {
        option.classList.remove("language-switcher__option--active");
      }
    });
  }

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Get current language
   */
  function getCurrentLanguage() {
    return LanguageSwitch.state.currentLanguage;
  }

  /**
   * Get available languages
   */
  function getAvailableLanguages() {
    return [...LanguageSwitch.state.availableLanguages];
  }

  /**
   * Check if language is loading
   */
  function isLoading() {
    return LanguageSwitch.state.isLoading;
  }

  /**
   * Get translation for key
   */
  function getTranslation(key, languageCode = null) {
    const lang = languageCode || LanguageSwitch.state.currentLanguage;
    const translations = LanguageSwitch.state.translationsCache.get(lang)?.data;

    if (!translations) return null;

    return getNestedTranslation(translations, key);
  }

  /**
   * Preload translations for language
   */
  function preloadTranslations(languageCode) {
    if (!LanguageSwitch.languages[languageCode]) {
      return Promise.reject(new Error("Unknown language"));
    }

    return loadTranslations(languageCode);
  }

  /**
   * Clear translation cache
   */
  function clearCache() {
    LanguageSwitch.state.translationsCache.clear();
  }

  // ================================
  // INITIALIZATION AND EXPORT
  // ================================

  // Create public API
  const publicAPI = {
    init,
    set: setLanguage,
    get: getCurrentLanguage,
    getAvailable: getAvailableLanguages,
    isLoading,
    getTranslation,
    preload: preloadTranslations,
    clearCache,

    // State access (read-only)
    getState: () => ({ ...LanguageSwitch.state }),
    getConfig: () => ({ ...LanguageSwitch.config }),
  };

  // Export to window
  window.languageSwitch = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
