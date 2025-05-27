/**
 * Bonobo Bar & More - Smooth Scroll Module
 * Complete smooth scrolling system with performance optimization
 *
 * Features:
 * - Smooth scrolling with easing functions
 * - Header offset calculation for fixed navigation
 * - Intersection observer for active navigation highlighting
 * - Keyboard and accessibility support
 * - Performance-optimized with requestAnimationFrame
 * - Reduced motion preference respect
 * - Cross-browser compatibility
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const SmoothScroll = {
    // Configuration
    config: {
      duration: 800,
      easing: "easeInOutCubic",
      offset: 80, // Default offset for fixed header
      updateURL: true,
      focusTarget: true,
      cancelOnUserAction: true,
      intersectionThreshold: 0.5,
      intersectionRootMargin: "-80px 0px -80px 0px",
    },

    // Current state
    state: {
      isScrolling: false,
      currentAnimation: null,
      prefersReducedMotion: false,
      headerHeight: 0,
      activeSection: null,
    },

    // DOM elements
    elements: {
      header: null,
      sections: null,
      navLinks: null,
    },

    // Intersection observer
    observer: null,

    // Easing functions
    easings: {
      linear: (t) => t,
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      easeInCubic: (t) => t * t * t,
      easeOutCubic: (t) => --t * t * t + 1,
      easeInOutCubic: (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      easeInQuart: (t) => t * t * t * t,
      easeOutQuart: (t) => 1 - --t * t * t * t,
      easeInOutQuart: (t) =>
        t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize smooth scroll
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Check for reduced motion preference
        checkReducedMotionPreference();

        // Cache DOM elements
        cacheDOMElements();

        // Calculate header height
        calculateHeaderHeight();

        // Setup event listeners
        setupEventListeners();

        // Initialize intersection observer
        if (SmoothScroll.elements.sections.length > 0) {
          initIntersectionObserver();
        }

        // Handle initial hash if present
        handleInitialHash();

        console.log("Smooth scroll initialized");
        resolve();
      } catch (error) {
        console.error("Smooth scroll initialization failed:", error);
        resolve();
      }
    });
  }

  /**
   * Check for reduced motion preference
   */
  function checkReducedMotionPreference() {
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      SmoothScroll.state.prefersReducedMotion = prefersReducedMotion.matches;

      // Listen for changes
      if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener("change", (e) => {
          SmoothScroll.state.prefersReducedMotion = e.matches;
        });
      }
    }
  }

  /**
   * Cache frequently used DOM elements
   */
  function cacheDOMElements() {
    SmoothScroll.elements.header = document.querySelector(".header");
    SmoothScroll.elements.sections = document.querySelectorAll("section[id]");
    SmoothScroll.elements.navLinks = document.querySelectorAll('a[href^="#"]');
  }

  /**
   * Calculate header height for offset
   */
  function calculateHeaderHeight() {
    if (SmoothScroll.elements.header) {
      SmoothScroll.state.headerHeight =
        SmoothScroll.elements.header.offsetHeight;
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Navigation link clicks
    SmoothScroll.elements.navLinks.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    // Window resize
    window.addEventListener("resize", debounce(handleResize, 250));

    // User scroll/keyboard events that should cancel smooth scroll
    if (SmoothScroll.config.cancelOnUserAction) {
      window.addEventListener("wheel", handleUserInteraction, {
        passive: true,
      });
      window.addEventListener("touchstart", handleUserInteraction, {
        passive: true,
      });
      window.addEventListener("keydown", handleKeyboardInteraction);
    }

    // Listen for app events
    document.addEventListener("app:scroll", handleAppScroll);
  }

  /**
   * Initialize intersection observer for active section tracking
   */
  function initIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const options = {
      threshold: SmoothScroll.config.intersectionThreshold,
      rootMargin: SmoothScroll.config.intersectionRootMargin,
    };

    SmoothScroll.observer = new IntersectionObserver(
      handleIntersection,
      options
    );

    SmoothScroll.elements.sections.forEach((section) => {
      SmoothScroll.observer.observe(section);
    });
  }

  // ================================
  // EVENT HANDLERS
  // ================================

  /**
   * Handle navigation link clicks
   */
  function handleLinkClick(event) {
    const href = event.currentTarget.getAttribute("href");

    // Only handle internal hash links
    if (!href || !href.startsWith("#") || href === "#") {
      return;
    }

    const targetElement = document.querySelector(href);
    if (!targetElement) {
      return;
    }

    event.preventDefault();

    // Scroll to target
    scrollTo(targetElement, {
      updateURL: SmoothScroll.config.updateURL ? href : false,
      focus: SmoothScroll.config.focusTarget,
    });
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    // Recalculate header height
    calculateHeaderHeight();

    // Update intersection observer if needed
    if (SmoothScroll.observer) {
      const newRootMargin = `-${SmoothScroll.state.headerHeight}px 0px -${SmoothScroll.state.headerHeight}px 0px`;

      // Recreate observer with new margin if it changed
      if (newRootMargin !== SmoothScroll.config.intersectionRootMargin) {
        SmoothScroll.observer.disconnect();
        SmoothScroll.config.intersectionRootMargin = newRootMargin;
        initIntersectionObserver();
      }
    }
  }

  /**
   * Handle user scroll/touch interactions
   */
  function handleUserInteraction() {
    if (SmoothScroll.state.isScrolling) {
      cancelScroll();
    }
  }

  /**
   * Handle keyboard interactions
   */
  function handleKeyboardInteraction(event) {
    // Cancel smooth scroll on navigation keys
    const cancelKeys = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      "Space",
    ];

    if (cancelKeys.includes(event.key) && SmoothScroll.state.isScrolling) {
      cancelScroll();
    }
  }

  /**
   * Handle app scroll events
   */
  function handleAppScroll(event) {
    // This could be used for additional scroll-based functionality
  }

  /**
   * Handle intersection observer changes
   */
  function handleIntersection(entries) {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        entry.intersectionRatio >= SmoothScroll.config.intersectionThreshold
      ) {
        updateActiveNavigation(entry.target.id);
      }
    });
  }

  /**
   * Handle initial hash in URL
   */
  function handleInitialHash() {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        // Delay to ensure page is fully loaded
        setTimeout(() => {
          scrollTo(targetElement, {
            updateURL: false,
            focus: false,
            duration: 0, // Instant scroll for initial load
          });
        }, 100);
      }
    }
  }

  // ================================
  // SCROLL FUNCTIONS
  // ================================

  /**
   * Scroll to target element
   */
  function scrollTo(target, options = {}) {
    if (!target) {
      console.warn("Scroll target not found");
      return Promise.reject(new Error("Target not found"));
    }

    // Merge options with defaults
    const opts = {
      duration: SmoothScroll.config.duration,
      easing: SmoothScroll.config.easing,
      offset: SmoothScroll.config.offset,
      updateURL: false,
      focus: false,
      ...options,
    };

    // Cancel any existing scroll
    if (SmoothScroll.state.isScrolling) {
      cancelScroll();
    }

    // Calculate target position
    const targetRect = target.getBoundingClientRect();
    const currentScrollY =
      window.pageYOffset || document.documentElement.scrollTop;
    const targetY = currentScrollY + targetRect.top - opts.offset;

    // If reduced motion is preferred or duration is 0, jump immediately
    if (SmoothScroll.state.prefersReducedMotion || opts.duration === 0) {
      window.scrollTo(0, targetY);

      if (opts.updateURL) {
        updateURL(opts.updateURL);
      }

      if (opts.focus) {
        focusTarget(target);
      }

      return Promise.resolve();
    }

    // Perform smooth scroll
    return new Promise((resolve) => {
      const startY = currentScrollY;
      const deltaY = targetY - startY;
      const startTime = performance.now();

      SmoothScroll.state.isScrolling = true;

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / opts.duration, 1);

        // Apply easing
        const easingFunction =
          SmoothScroll.easings[opts.easing] ||
          SmoothScroll.easings.easeInOutCubic;
        const easedProgress = easingFunction(progress);

        // Calculate new position
        const newY = startY + deltaY * easedProgress;

        // Scroll to new position
        window.scrollTo(0, newY);

        // Continue animation if not complete
        if (progress < 1 && SmoothScroll.state.isScrolling) {
          SmoothScroll.state.currentAnimation = requestAnimationFrame(animate);
        } else {
          // Animation complete
          SmoothScroll.state.isScrolling = false;
          SmoothScroll.state.currentAnimation = null;

          // Update URL if requested
          if (opts.updateURL) {
            updateURL(opts.updateURL);
          }

          // Focus target if requested
          if (opts.focus) {
            focusTarget(target);
          }

          resolve();
        }
      }

      SmoothScroll.state.currentAnimation = requestAnimationFrame(animate);
    });
  }

  /**
   * Cancel current scroll animation
   */
  function cancelScroll() {
    if (SmoothScroll.state.currentAnimation) {
      cancelAnimationFrame(SmoothScroll.state.currentAnimation);
      SmoothScroll.state.currentAnimation = null;
    }

    SmoothScroll.state.isScrolling = false;
  }

  /**
   * Update URL with hash
   */
  function updateURL(hash) {
    if (!hash) return;

    try {
      // Use history.replaceState to avoid adding to history
      const newURL = window.location.pathname + window.location.search + hash;
      history.replaceState(null, "", newURL);
    } catch (error) {
      console.warn("Failed to update URL:", error);
    }
  }

  /**
   * Focus target element for accessibility
   */
  function focusTarget(target) {
    if (!target) return;

    try {
      // Set tabindex if element is not naturally focusable
      const isNaturallyFocusable = target.matches(
        "a, button, input, textarea, select, [tabindex]"
      );

      if (!isNaturallyFocusable) {
        target.setAttribute("tabindex", "-1");
      }

      target.focus();

      // Remove temporary tabindex after focus
      if (!isNaturallyFocusable) {
        setTimeout(() => {
          target.removeAttribute("tabindex");
        }, 100);
      }
    } catch (error) {
      console.warn("Failed to focus target:", error);
    }
  }

  /**
   * Update active navigation highlighting
   */
  function updateActiveNavigation(sectionId) {
    if (SmoothScroll.state.activeSection === sectionId) return;

    SmoothScroll.state.activeSection = sectionId;

    // Update navigation links
    SmoothScroll.elements.navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${sectionId}`;

      // Update aria-current
      if (isActive) {
        link.setAttribute("aria-current", "page");
        link.classList.add("nav__link--active");
      } else {
        link.removeAttribute("aria-current");
        link.classList.remove("nav__link--active");
      }
    });

    // Dispatch event
    document.dispatchEvent(
      new CustomEvent("smoothscroll:activechange", {
        detail: { sectionId, element: document.getElementById(sectionId) },
      })
    );
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  /**
   * Debounce function for performance
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Get element position relative to viewport
   */
  function getElementPosition(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      bottom: rect.bottom + scrollTop,
      height: rect.height,
    };
  }

  /**
   * Check if element is in viewport
   */
  function isInViewport(element, threshold = 0) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return rect.top >= -threshold && rect.bottom <= windowHeight + threshold;
  }

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Scroll to element by selector or element
   */
  function scrollToElement(target, options = {}) {
    let element;

    if (typeof target === "string") {
      element = document.querySelector(target);
    } else if (target && target.nodeType === Node.ELEMENT_NODE) {
      element = target;
    }

    if (!element) {
      return Promise.reject(new Error("Invalid target"));
    }

    return scrollTo(element, options);
  }

  /**
   * Scroll to top of page
   */
  function scrollToTop(options = {}) {
    return new Promise((resolve) => {
      const opts = {
        duration: SmoothScroll.config.duration,
        easing: SmoothScroll.config.easing,
        ...options,
      };

      if (SmoothScroll.state.prefersReducedMotion || opts.duration === 0) {
        window.scrollTo(0, 0);
        resolve();
        return;
      }

      const startY = window.pageYOffset || document.documentElement.scrollTop;
      const startTime = performance.now();

      SmoothScroll.state.isScrolling = true;

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / opts.duration, 1);

        const easingFunction =
          SmoothScroll.easings[opts.easing] ||
          SmoothScroll.easings.easeInOutCubic;
        const easedProgress = easingFunction(progress);

        const newY = startY * (1 - easedProgress);
        window.scrollTo(0, newY);

        if (progress < 1 && SmoothScroll.state.isScrolling) {
          SmoothScroll.state.currentAnimation = requestAnimationFrame(animate);
        } else {
          SmoothScroll.state.isScrolling = false;
          SmoothScroll.state.currentAnimation = null;
          resolve();
        }
      }

      SmoothScroll.state.currentAnimation = requestAnimationFrame(animate);
    });
  }

  /**
   * Get current active section
   */
  function getActiveSection() {
    return SmoothScroll.state.activeSection;
  }

  /**
   * Check if currently scrolling
   */
  function isScrolling() {
    return SmoothScroll.state.isScrolling;
  }

  /**
   * Update configuration
   */
  function updateConfig(newConfig) {
    Object.assign(SmoothScroll.config, newConfig);
  }

  // ================================
  // INITIALIZATION AND EXPORT
  // ================================

  // Create public API
  const publicAPI = {
    init,
    scrollTo: scrollToElement,
    scrollToTop,
    cancel: cancelScroll,
    getActiveSection,
    isScrolling,
    updateConfig,

    // Utility functions
    getElementPosition,
    isInViewport,

    // State access (read-only)
    getState: () => ({ ...SmoothScroll.state }),
    getConfig: () => ({ ...SmoothScroll.config }),
  };

  // Export to window
  window.smoothScroll = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
