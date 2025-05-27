/**
 * Bonobo Bar & More - Theme Switcher Module
 * Complete dark/light mode system with smooth transitions
 *
 * Features:
 * - Smooth theme transitions with CSS custom properties
 * - System preference detection and respect
 * - localStorage persistence across sessions
 * - Accessible keyboard and screen reader support
 * - Performance-optimized theme switching
 * - CSS-in-JS fallback for unsupported browsers
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const ThemeSwitch = {
    // Configuration
    config: {
      storageKey: "bonobo-theme",
      attribute: "data-theme",
      transitionDuration: 300,
      toggleSelector: "[data-theme-toggle]",
      preferenceQuery: "(prefers-color-scheme: dark)",
      reducedMotionQuery: "(prefers-reduced-motion: reduce)",
    },

    // Current state
    state: {
      currentTheme: "light",
      systemPreference: "light",
      isTransitioning: false,
      supportsCustomProperties: false,
      prefersReducedMotion: false,
    },

    // DOM elements
    elements: {
      toggleButton: null,
      htmlElement: null,
      bodyElement: null,
    },

    // Theme definitions
    themes: {
      light: {
        name: "light",
        label: "Light Mode",
        icon: "☀️",
        ariaLabel: "Switch to dark mode",
      },
      dark: {
        name: "dark",
        label: "Dark Mode",
        icon: "🌙",
        ariaLabel: "Switch to light mode",
      },
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize theme switcher
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Cache DOM elements
        cacheDOMElements();

        // Check browser support
        checkBrowserSupport();

        // Detect system preferences
        detectSystemPreferences();

        // Load saved theme or use system preference
        loadThemePreference();

        // Setup event listeners
        setupEventListeners();

        // Apply initial theme
        applyTheme(ThemeSwitch.state.currentTheme, false);

        // Setup toggle button
        updateToggleButton();

        console.log(
          "Theme switcher initialized:",
          ThemeSwitch.state.currentTheme
        );
        resolve();
      } catch (error) {
        console.error("Theme switcher initialization failed:", error);
        // Fallback to light theme
        ThemeSwitch.state.currentTheme = "light";
        resolve();
      }
    });
  }

  /**
   * Cache frequently used DOM elements
   */
  function cacheDOMElements() {
    ThemeSwitch.elements.htmlElement = document.documentElement;
    ThemeSwitch.elements.bodyElement = document.body;
    ThemeSwitch.elements.toggleButton = document.querySelector(
      ThemeSwitch.config.toggleSelector
    );
  }

  /**
   * Check browser support for features
   */
  function checkBrowserSupport() {
    // Check CSS custom properties support
    ThemeSwitch.state.supportsCustomProperties =
      window.CSS && CSS.supports("color", "var(--primary)");

    // Check reduced motion preference
    if (window.matchMedia) {
      ThemeSwitch.state.prefersReducedMotion = window.matchMedia(
        ThemeSwitch.config.reducedMotionQuery
      ).matches;
    }
  }

  /**
   * Detect system color scheme preference
   */
  function detectSystemPreferences() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia(
        ThemeSwitch.config.preferenceQuery
      );
      ThemeSwitch.state.systemPreference = darkModeQuery.matches
        ? "dark"
        : "light";

      // Listen for system preference changes
      if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener("change", handleSystemPreferenceChange);
      } else {
        // Fallback for older browsers
        darkModeQuery.addListener(handleSystemPreferenceChange);
      }
    }
  }

  /**
   * Load theme preference from storage or system
   */
  function loadThemePreference() {
    try {
      const savedTheme = localStorage.getItem(ThemeSwitch.config.storageKey);

      if (savedTheme && ThemeSwitch.themes[savedTheme]) {
        ThemeSwitch.state.currentTheme = savedTheme;
      } else {
        // Use system preference
        ThemeSwitch.state.currentTheme = ThemeSwitch.state.systemPreference;
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error);
      ThemeSwitch.state.currentTheme = ThemeSwitch.state.systemPreference;
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Toggle button click
    if (ThemeSwitch.elements.toggleButton) {
      ThemeSwitch.elements.toggleButton.addEventListener(
        "click",
        handleToggleClick
      );

      // Keyboard support
      ThemeSwitch.elements.toggleButton.addEventListener(
        "keydown",
        handleToggleKeydown
      );
    }

    // Listen for app events
    document.addEventListener("app:themechange", handleExternalThemeChange);

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
    toggleTheme();
  }

  /**
   * Handle toggle button keyboard interaction
   */
  function handleToggleKeydown(event) {
    // Activate on Space or Enter
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggleTheme();
    }
  }

  /**
   * Handle system preference changes
   */
  function handleSystemPreferenceChange(event) {
    const newSystemPreference = event.matches ? "dark" : "light";
    ThemeSwitch.state.systemPreference = newSystemPreference;

    // Only update if user hasn't explicitly set a preference
    const savedTheme = localStorage.getItem(ThemeSwitch.config.storageKey);
    if (!savedTheme) {
      setTheme(newSystemPreference, true);
    }

    // Dispatch system preference change event
    document.dispatchEvent(
      new CustomEvent("theme:systemchange", {
        detail: { theme: newSystemPreference },
      })
    );
  }

  /**
   * Handle external theme change requests
   */
  function handleExternalThemeChange(event) {
    if (event.detail && event.detail.theme) {
      setTheme(event.detail.theme, true);
    }
  }

  /**
   * Handle page visibility changes
   */
  function handleVisibilityChange() {
    if (!document.hidden) {
      // Page is visible again, refresh theme in case system preference changed
      detectSystemPreferences();
    }
  }

  // ================================
  // THEME MANAGEMENT
  // ================================

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const newTheme =
      ThemeSwitch.state.currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme, true);
  }

  /**
   * Set specific theme
   */
  function setTheme(themeName, animate = true, save = true) {
    if (!ThemeSwitch.themes[themeName]) {
      console.warn("Unknown theme:", themeName);
      return;
    }

    if (ThemeSwitch.state.isTransitioning) {
      return; // Prevent rapid theme changes
    }

    const previousTheme = ThemeSwitch.state.currentTheme;
    ThemeSwitch.state.currentTheme = themeName;

    // Apply theme with optional animation
    applyTheme(themeName, animate);

    // Save preference
    if (save) {
      saveThemePreference(themeName);
    }

    // Update toggle button
    updateToggleButton();

    // Dispatch theme change event
    document.dispatchEvent(
      new CustomEvent("theme:change", {
        detail: {
          theme: themeName,
          previousTheme: previousTheme,
          isUserInitiated: save,
        },
      })
    );
  }

  /**
   * Apply theme to document
   */
  function applyTheme(themeName, animate = true) {
    if (ThemeSwitch.state.isTransitioning) return;

    const shouldAnimate = animate && !ThemeSwitch.state.prefersReducedMotion;

    if (shouldAnimate) {
      ThemeSwitch.state.isTransitioning = true;

      // Add transition class
      ThemeSwitch.elements.htmlElement.classList.add("theme-transitioning");
    }

    // Set theme attribute
    ThemeSwitch.elements.htmlElement.setAttribute(
      ThemeSwitch.config.attribute,
      themeName
    );

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(themeName);

    if (shouldAnimate) {
      // Remove transition class after animation
      setTimeout(() => {
        ThemeSwitch.elements.htmlElement.classList.remove(
          "theme-transitioning"
        );
        ThemeSwitch.state.isTransitioning = false;
      }, ThemeSwitch.config.transitionDuration);
    }
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  function updateMetaThemeColor(themeName) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    // Set appropriate color based on theme
    const colors = {
      light: "#231942", // Brand primary
      dark: "#121212", // Dark footer background
    };

    metaThemeColor.content = colors[themeName] || colors.light;
  }

  /**
   * Save theme preference to localStorage
   */
  function saveThemePreference(themeName) {
    try {
      localStorage.setItem(ThemeSwitch.config.storageKey, themeName);
    } catch (error) {
      console.warn("Could not save theme preference:", error);
    }
  }

  /**
   * Update toggle button state and accessibility
   */
  function updateToggleButton() {
    if (!ThemeSwitch.elements.toggleButton) return;

    const currentTheme = ThemeSwitch.themes[ThemeSwitch.state.currentTheme];
    const nextTheme =
      ThemeSwitch.themes[
        ThemeSwitch.state.currentTheme === "light" ? "dark" : "light"
      ];

    // Update aria-label for screen readers
    ThemeSwitch.elements.toggleButton.setAttribute(
      "aria-label",
      nextTheme.ariaLabel
    );

    // Update aria-pressed state
    ThemeSwitch.elements.toggleButton.setAttribute(
      "aria-pressed",
      ThemeSwitch.state.currentTheme === "dark" ? "true" : "false"
    );

    // Update visual state (handled by CSS based on data-theme attribute)

    // Optional: Update button text if it contains text
    const buttonText = ThemeSwitch.elements.toggleButton.querySelector(
      ".theme-toggle__text"
    );
    if (buttonText) {
      buttonText.textContent = nextTheme.label;
    }
  }

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Get current theme
   */
  function getCurrentTheme() {
    return ThemeSwitch.state.currentTheme;
  }

  /**
   * Get system preference
   */
  function getSystemPreference() {
    return ThemeSwitch.state.systemPreference;
  }

  /**
   * Check if theme is transitioning
   */
  function isTransitioning() {
    return ThemeSwitch.state.isTransitioning;
  }

  /**
   * Force theme refresh (useful after external changes)
   */
  function refresh() {
    applyTheme(ThemeSwitch.state.currentTheme, false);
    updateToggleButton();
  }

  /**
   * Reset to system preference
   */
  function resetToSystem() {
    try {
      localStorage.removeItem(ThemeSwitch.config.storageKey);
      setTheme(ThemeSwitch.state.systemPreference, true, false);
    } catch (error) {
      console.warn("Could not reset theme preference:", error);
    }
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  /**
   * Get theme-aware color value
   */
  function getThemeColor(colorVar) {
    if (!ThemeSwitch.state.supportsCustomProperties) {
      return null;
    }

    const computedStyle = getComputedStyle(ThemeSwitch.elements.htmlElement);
    return computedStyle.getPropertyValue(colorVar).trim();
  }

  /**
   * Check if dark theme is active
   */
  function isDarkTheme() {
    return ThemeSwitch.state.currentTheme === "dark";
  }

  /**
   * Check if light theme is active
   */
  function isLightTheme() {
    return ThemeSwitch.state.currentTheme === "light";
  }

  // ================================
  // CSS TRANSITION STYLES
  // ================================

  /**
   * Inject transition styles for smooth theme switching
   */
  function injectTransitionStyles() {
    if (ThemeSwitch.state.prefersReducedMotion) return;

    const styleId = "theme-transition-styles";
    if (document.getElementById(styleId)) return;

    const styles = `
        .theme-transitioning,
        .theme-transitioning *,
        .theme-transitioning *:before,
        .theme-transitioning *:after {
          transition: background-color ${ThemeSwitch.config.transitionDuration}ms ease,
                      border-color ${ThemeSwitch.config.transitionDuration}ms ease,
                      color ${ThemeSwitch.config.transitionDuration}ms ease,
                      fill ${ThemeSwitch.config.transitionDuration}ms ease,
                      stroke ${ThemeSwitch.config.transitionDuration}ms ease,
                      opacity ${ThemeSwitch.config.transitionDuration}ms ease,
                      box-shadow ${ThemeSwitch.config.transitionDuration}ms ease !important;
          transition-delay: 0s !important;
        }
      `;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // ================================
  // INITIALIZATION AND EXPORT
  // ================================

  // Inject transition styles immediately
  if (document.head) {
    injectTransitionStyles();
  } else {
    document.addEventListener("DOMContentLoaded", injectTransitionStyles);
  }

  // Create public API
  const publicAPI = {
    init,
    toggle: toggleTheme,
    set: setTheme,
    get: getCurrentTheme,
    getSystemPreference,
    isTransitioning,
    refresh,
    resetToSystem,
    getThemeColor,
    isDark: isDarkTheme,
    isLight: isLightTheme,

    // State access (read-only)
    getState: () => ({ ...ThemeSwitch.state }),
    getConfig: () => ({ ...ThemeSwitch.config }),
  };

  // Export to window
  window.themeSwitch = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
