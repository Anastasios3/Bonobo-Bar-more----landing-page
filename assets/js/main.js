/**
 * Bonobo Bar & More - Main JavaScript Entry Point
 * Application initialization and coordination
 *
 * This file orchestrates all JavaScript functionality including:
 * - Theme system initialization
 * - Language system setup
 * - Navigation and smooth scrolling
 * - Lazy loading and performance optimization
 * - Cookie consent management
 * - Progressive enhancement patterns
 */

(function () {
  "use strict";

  // ================================
  // APPLICATION STATE
  // ================================

  const App = {
    // Configuration
    config: {
      debounceDelay: 250,
      throttleDelay: 16,
      animationDuration: 300,
      lazyLoadMargin: "50px",
      smoothScrollOffset: 80,
    },

    // State management
    state: {
      isLoading: true,
      currentTheme: "light",
      currentLanguage: "en",
      isMenuOpen: false,
      scrollDirection: "up",
      lastScrollY: 0,
    },

    // Module references
    modules: {},

    // Performance utilities
    utils: {
      debounce: null,
      throttle: null,
      raf: null,
    },
  };

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  /**
   * Debounce function for performance optimization
   */
  App.utils.debounce = function (func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  };

  /**
   * Throttle function for scroll and resize events
   */
  App.utils.throttle = function (func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  /**
   * RequestAnimationFrame utility
   */
  App.utils.raf = function (callback) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(callback);
    } else {
      return setTimeout(callback, 16);
    }
  };

  /**
   * Modern event listener with options support
   */
  function addEventListenerSafe(element, event, handler, options = {}) {
    if (!element || !event || !handler) return;

    try {
      // Check for passive event listener support
      let passiveSupported = false;
      try {
        const options = Object.defineProperty({}, "passive", {
          get: function () {
            passiveSupported = true;
            return false;
          },
        });
        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
      } catch (err) {
        passiveSupported = false;
      }

      const eventOptions = passiveSupported
        ? options
        : options.capture || false;
      element.addEventListener(event, handler, eventOptions);
    } catch (error) {
      console.warn("Event listener not added:", error);
    }
  }

  /**
   * Check if element is in viewport
   */
  function isInViewport(element, threshold = 0) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  }

  /**
   * Get system preferences
   */
  function getSystemPreferences() {
    return {
      prefersReducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches,
      prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)")
        .matches,
      prefersHighContrast: window.matchMedia("(prefers-contrast: high)")
        .matches,
    };
  }

  // ================================
  // CORE INITIALIZATION
  // ================================

  /**
   * Initialize application
   */
  function init() {
    console.log("Initializing Bonobo Bar & More website...");

    // Set initial state
    updateAppState();

    // Initialize modules in order
    initializeModules()
      .then(() => {
        // Setup event listeners
        setupEventListeners();

        // Handle initial page state
        handlePageLoad();

        // Mark app as ready
        markAppReady();

        console.log("Application initialized successfully");
      })
      .catch((error) => {
        console.error("Application initialization failed:", error);
        // Fallback to basic functionality
        markAppReady();
      });
  }

  /**
   * Update application state from DOM and localStorage
   */
  function updateAppState() {
    // Get theme from DOM or localStorage
    const savedTheme = localStorage.getItem("bonobo-theme");
    const systemPrefs = getSystemPreferences();
    const htmlElement = document.documentElement;

    App.state.currentTheme =
      savedTheme || (systemPrefs.prefersDarkMode ? "dark" : "light");

    // Get language from DOM or localStorage
    const savedLanguage = localStorage.getItem("bonobo-language");
    const bodyLang = document.body.getAttribute("data-lang");

    App.state.currentLanguage = savedLanguage || bodyLang || "en";

    // Update DOM to reflect state
    htmlElement.setAttribute("data-theme", App.state.currentTheme);
    document.body.setAttribute("data-lang", App.state.currentLanguage);
  }

  /**
   * Initialize all modules
   */
  async function initializeModules() {
    const modulePromises = [];

    // Core modules (must load first)
    const coreModules = ["themeSwitch", "languageSwitch", "smoothScroll"];

    // Enhanced modules (can load in parallel)
    const enhancedModules = ["lazyLoading", "animations", "cookieConsent"];

    // Initialize core modules sequentially
    for (const moduleName of coreModules) {
      try {
        if (
          window[moduleName] &&
          typeof window[moduleName].init === "function"
        ) {
          await window[moduleName].init();
          App.modules[moduleName] = window[moduleName];
          console.log(`Module ${moduleName} initialized`);
        }
      } catch (error) {
        console.warn(`Failed to initialize ${moduleName}:`, error);
      }
    }

    // Initialize enhanced modules in parallel
    const enhancedPromises = enhancedModules.map(async (moduleName) => {
      try {
        if (
          window[moduleName] &&
          typeof window[moduleName].init === "function"
        ) {
          await window[moduleName].init();
          App.modules[moduleName] = window[moduleName];
          console.log(`Module ${moduleName} initialized`);
        }
      } catch (error) {
        console.warn(`Failed to initialize ${moduleName}:`, error);
      }
    });

    await Promise.allSettled(enhancedPromises);
  }

  /**
   * Setup global event listeners
   */
  function setupEventListeners() {
    // Scroll events
    const scrollHandler = App.utils.throttle(
      handleScroll,
      App.config.throttleDelay
    );
    addEventListenerSafe(window, "scroll", scrollHandler, { passive: true });

    // Resize events
    const resizeHandler = App.utils.debounce(
      handleResize,
      App.config.debounceDelay
    );
    addEventListenerSafe(window, "resize", resizeHandler, { passive: true });

    // Page visibility changes
    addEventListenerSafe(document, "visibilitychange", handleVisibilityChange);

    // Before unload
    addEventListenerSafe(window, "beforeunload", handleBeforeUnload);

    // Navigation clicks
    setupNavigationHandlers();

    // Mobile menu handling
    setupMobileMenuHandlers();

    // Keyboard navigation
    setupKeyboardHandlers();
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    const currentScrollY =
      window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector(".header");

    // Update scroll direction
    if (currentScrollY > App.state.lastScrollY) {
      App.state.scrollDirection = "down";
    } else {
      App.state.scrollDirection = "up";
    }

    // Header scroll effects
    if (header) {
      if (currentScrollY > 100) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }

      // Hide/show header based on scroll direction
      if (currentScrollY > 200) {
        if (App.state.scrollDirection === "down" && !App.state.isMenuOpen) {
          header.classList.add("header--hidden");
        } else {
          header.classList.remove("header--hidden");
        }
      }
    }

    App.state.lastScrollY = currentScrollY;

    // Trigger scroll events for modules
    document.dispatchEvent(
      new CustomEvent("app:scroll", {
        detail: {
          scrollY: currentScrollY,
          direction: App.state.scrollDirection,
        },
      })
    );
  }

  /**
   * Handle resize events
   */
  function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && App.state.isMenuOpen) {
      closeMobileMenu();
    }

    // Trigger resize events for modules
    document.dispatchEvent(
      new CustomEvent("app:resize", {
        detail: { width: window.innerWidth, height: window.innerHeight },
      })
    );
  }

  /**
   * Handle page visibility changes
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden
      document.dispatchEvent(new CustomEvent("app:hidden"));
    } else {
      // Page is visible
      document.dispatchEvent(new CustomEvent("app:visible"));
    }
  }

  /**
   * Handle before page unload
   */
  function handleBeforeUnload() {
    // Clean up any resources
    document.dispatchEvent(new CustomEvent("app:beforeunload"));
  }

  /**
   * Setup navigation click handlers
   */
  function setupNavigationHandlers() {
    const navLinks = document.querySelectorAll(".nav__link, .footer__link");

    navLinks.forEach((link) => {
      // Only handle internal links
      if (link.getAttribute("href")?.startsWith("#")) {
        addEventListenerSafe(link, "click", handleNavClick);
      }
    });
  }

  /**
   * Handle navigation clicks
   */
  function handleNavClick(event) {
    const href = event.currentTarget.getAttribute("href");

    if (href && href.startsWith("#")) {
      event.preventDefault();

      const targetElement = document.querySelector(href);
      if (targetElement && App.modules.smoothScroll) {
        App.modules.smoothScroll.scrollTo(targetElement);

        // Close mobile menu if open
        if (App.state.isMenuOpen) {
          closeMobileMenu();
        }

        // Update active nav state
        updateActiveNavState(href);
      }
    }
  }

  /**
   * Setup mobile menu handlers
   */
  function setupMobileMenuHandlers() {
    const menuToggle = document.querySelector("[data-nav-toggle]");

    if (menuToggle) {
      addEventListenerSafe(menuToggle, "click", toggleMobileMenu);
    }

    // Close menu when clicking outside
    addEventListenerSafe(document, "click", (event) => {
      const nav = document.querySelector(".nav");
      if (App.state.isMenuOpen && nav && !nav.contains(event.target)) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    if (App.state.isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    const menuToggle = document.querySelector("[data-nav-toggle]");
    const body = document.body;

    App.state.isMenuOpen = true;

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
    }

    body.style.overflow = "hidden";

    // Dispatch event
    document.dispatchEvent(new CustomEvent("app:menuopen"));
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    const menuToggle = document.querySelector("[data-nav-toggle]");
    const body = document.body;

    App.state.isMenuOpen = false;

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    body.style.overflow = "";

    // Dispatch event
    document.dispatchEvent(new CustomEvent("app:menuclose"));
  }

  /**
   * Setup keyboard navigation
   */
  function setupKeyboardHandlers() {
    addEventListenerSafe(document, "keydown", (event) => {
      // ESC key closes mobile menu
      if (event.key === "Escape" && App.state.isMenuOpen) {
        closeMobileMenu();
      }

      // Tab navigation enhancements
      if (event.key === "Tab") {
        document.body.classList.add("using-keyboard");
      }
    });

    // Remove keyboard class on mouse use
    addEventListenerSafe(document, "mousedown", () => {
      document.body.classList.remove("using-keyboard");
    });
  }

  /**
   * Update active navigation state
   */
  function updateActiveNavState(activeHref) {
    const navLinks = document.querySelectorAll(".nav__link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === activeHref) {
        link.setAttribute("aria-current", "page");
        link.classList.add("nav__link--active");
      } else {
        link.removeAttribute("aria-current");
        link.classList.remove("nav__link--active");
      }
    });
  }

  /**
   * Handle initial page load
   */
  function handlePageLoad() {
    // Handle hash navigation on load
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement && App.modules.smoothScroll) {
          App.modules.smoothScroll.scrollTo(targetElement);
          updateActiveNavState(window.location.hash);
        }
      }, 100);
    }

    // Initialize intersection observer for nav highlighting
    setupIntersectionObserver();
  }

  /**
   * Setup intersection observer for navigation highlighting
   */
  function setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            updateActiveNavState(`#${entry.target.id}`);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-80px 0px -80px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /**
   * Mark application as ready
   */
  function markAppReady() {
    App.state.isLoading = false;

    // Remove loading class
    document.body.classList.remove("loading");

    // Hide loading screen
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");

      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }

    // Add loaded class for CSS animations
    document.body.classList.add("loaded");

    // Dispatch app ready event
    document.dispatchEvent(new CustomEvent("app:ready"));

    // Initialize performance monitoring
    if (window.performance && window.performance.mark) {
      window.performance.mark("app-ready");
    }
  }

  // ================================
  // PUBLIC API
  // ================================

  // Expose App object to window for debugging
  window.BonoboApp = App;

  // Expose useful methods
  window.BonoboApp.utils = App.utils;
  window.BonoboApp.getState = () => ({ ...App.state });
  window.BonoboApp.getModules = () => ({ ...App.modules });

  // ================================
  // INITIALIZATION
  // ================================

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    addEventListenerSafe(document, "DOMContentLoaded", init);
  } else {
    // DOM is already ready
    init();
  }

  // Fallback initialization after window load
  addEventListenerSafe(window, "load", () => {
    if (App.state.isLoading) {
      console.warn("Fallback initialization triggered");
      markAppReady();
    }
  });
})();
