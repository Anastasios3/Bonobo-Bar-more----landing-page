/**
 * Bonobo Bar & More - Animations Module
 * Complete animation system with scroll triggers and performance optimization
 *
 * Features:
 * - Intersection Observer for scroll-triggered animations
 * - Staggered animations with configurable delays
 * - Parallax effects for enhanced visual experience
 * - CSS class-based animation system
 * - Reduced motion preference support
 * - Performance-optimized with RAF
 * - Counter animations for numbers
 * - Reveal animations for content sections
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const Animations = {
    // Configuration
    config: {
      // Selectors for different animation types
      revealSelector: "[data-reveal]",
      counterSelector: "[data-counter]",
      parallaxSelector: "[data-parallax]",
      staggerSelector: "[data-stagger]",

      // Intersection Observer settings
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,

      // Animation settings
      staggerDelay: 100,
      counterDuration: 2000,
      parallaxFactor: 0.5,

      // Performance settings
      useRAF: true,
      maxParallaxElements: 10,
    },

    // Current state
    state: {
      observer: null,
      parallaxElements: [],
      counters: new Map(),
      isScrolling: false,
      lastScrollY: 0,
      prefersReducedMotion: false,
      isInitialized: false,
    },

    // Animation classes
    classes: {
      hidden: "animate-hidden",
      visible: "animate-visible",
      fadeIn: "animate-fade-in",
      slideUp: "animate-slide-up",
      slideDown: "animate-slide-down",
      slideLeft: "animate-slide-left",
      slideRight: "animate-slide-right",
      scaleUp: "animate-scale-up",
      stagger: "animate-stagger",
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize animations
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Check for reduced motion preference
        checkReducedMotionPreference();

        // Inject animation styles
        injectAnimationStyles();

        // Initialize intersection observer
        initIntersectionObserver();

        // Process animation elements
        processAnimationElements();

        // Setup scroll effects
        setupScrollEffects();

        // Setup event listeners
        setupEventListeners();

        Animations.state.isInitialized = true;

        console.log("Animations initialized");
        resolve();
      } catch (error) {
        console.error("Animations initialization failed:", error);
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
      Animations.state.prefersReducedMotion = prefersReducedMotion.matches;

      // Listen for changes
      if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener("change", (e) => {
          Animations.state.prefersReducedMotion = e.matches;

          if (e.matches) {
            // Disable animations
            disableAnimations();
          } else {
            // Re-enable animations
            enableAnimations();
          }
        });
      }
    }
  }

  /**
   * Initialize intersection observer
   */
  function initIntersectionObserver() {
    if (!window.IntersectionObserver) {
      console.warn("IntersectionObserver not supported, using fallback");
      return;
    }

    const options = {
      rootMargin: Animations.config.rootMargin,
      threshold: Animations.config.threshold,
    };

    Animations.state.observer = new IntersectionObserver(
      handleIntersection,
      options
    );
  }

  /**
   * Process all animation elements
   */
  function processAnimationElements() {
    // Process reveal animations
    const revealElements = document.querySelectorAll(
      Animations.config.revealSelector
    );
    revealElements.forEach((element) => {
      setupRevealAnimation(element);
    });

    // Process counter animations
    const counterElements = document.querySelectorAll(
      Animations.config.counterSelector
    );
    counterElements.forEach((element) => {
      setupCounterAnimation(element);
    });

    // Process parallax elements
    const parallaxElements = document.querySelectorAll(
      Animations.config.parallaxSelector
    );
    parallaxElements.forEach((element) => {
      setupParallaxAnimation(element);
    });

    // Process stagger animations
    const staggerContainers = document.querySelectorAll(
      Animations.config.staggerSelector
    );
    staggerContainers.forEach((container) => {
      setupStaggerAnimation(container);
    });
  }

  /**
   * Setup scroll effects
   */
  function setupScrollEffects() {
    if (Animations.state.parallaxElements.length > 0) {
      const handleScroll = Animations.config.useRAF
        ? () => {
            if (!Animations.state.isScrolling) {
              requestAnimationFrame(updateParallaxElements);
            }
            Animations.state.isScrolling = true;
          }
        : throttle(updateParallaxElements, 16);

      window.addEventListener("scroll", handleScroll, { passive: true });
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Listen for app events
    document.addEventListener("app:visible", handlePageVisible);
    document.addEventListener("app:hidden", handlePageHidden);

    // Listen for theme changes
    document.addEventListener("theme:change", handleThemeChange);

    // Listen for window resize
    window.addEventListener("resize", throttle(handleResize, 250));
  }

  // ================================
  // ANIMATION SETUP FUNCTIONS
  // ================================

  /**
   * Setup reveal animation for element
   */
  function setupRevealAnimation(element) {
    if (Animations.state.prefersReducedMotion) {
      return;
    }

    const animationType = element.getAttribute("data-reveal") || "fade-in";
    const delay = parseInt(element.getAttribute("data-delay")) || 0;

    // Add initial hidden class
    element.classList.add(Animations.classes.hidden);

    // Store animation data
    element.animationData = {
      type: animationType,
      delay: delay,
      hasAnimated: false,
    };

    // Observe element if intersection observer is available
    if (Animations.state.observer) {
      Animations.state.observer.observe(element);
    } else {
      // Fallback: animate immediately
      setTimeout(() => {
        triggerRevealAnimation(element);
      }, delay);
    }
  }

  /**
   * Setup counter animation for element
   */
  function setupCounterAnimation(element) {
    const targetValue = parseInt(element.getAttribute("data-counter")) || 0;
    const duration =
      parseInt(element.getAttribute("data-duration")) ||
      Animations.config.counterDuration;
    const startValue = parseInt(element.getAttribute("data-start")) || 0;

    // Store counter data
    element.counterData = {
      target: targetValue,
      duration: duration,
      start: startValue,
      current: startValue,
      hasAnimated: false,
    };

    // Set initial value
    element.textContent = startValue;

    // Observe element
    if (Animations.state.observer) {
      Animations.state.observer.observe(element);
    }
  }

  /**
   * Setup parallax animation for element
   */
  function setupParallaxAnimation(element) {
    if (Animations.state.prefersReducedMotion) {
      return;
    }

    const factor =
      parseFloat(element.getAttribute("data-parallax")) ||
      Animations.config.parallaxFactor;
    const direction = element.getAttribute("data-parallax-direction") || "up";

    // Store parallax data
    element.parallaxData = {
      factor: factor,
      direction: direction,
      initialOffset: 0,
    };

    // Add to parallax elements array
    Animations.state.parallaxElements.push(element);

    // Limit number of parallax elements for performance
    if (
      Animations.state.parallaxElements.length >
      Animations.config.maxParallaxElements
    ) {
      console.warn(
        "Too many parallax elements, some may be skipped for performance"
      );
    }
  }

  /**
   * Setup stagger animation for container
   */
  function setupStaggerAnimation(container) {
    if (Animations.state.prefersReducedMotion) {
      return;
    }

    const children = container.children;
    const staggerDelay =
      parseInt(container.getAttribute("data-stagger-delay")) ||
      Animations.config.staggerDelay;

    // Store stagger data
    container.staggerData = {
      delay: staggerDelay,
      children: Array.from(children),
      hasAnimated: false,
    };

    // Hide children initially
    Array.from(children).forEach((child, index) => {
      child.classList.add(Animations.classes.hidden);
      child.staggerIndex = index;
    });

    // Observe container
    if (Animations.state.observer) {
      Animations.state.observer.observe(container);
    }
  }

  // ================================
  // EVENT HANDLERS
  // ================================

  /**
   * Handle intersection observer changes
   */
  function handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Trigger appropriate animation
        if (element.hasAttribute("data-reveal")) {
          triggerRevealAnimation(element);
        } else if (element.hasAttribute("data-counter")) {
          triggerCounterAnimation(element);
        } else if (element.hasAttribute("data-stagger")) {
          triggerStaggerAnimation(element);
        }

        // Stop observing element after animation
        Animations.state.observer.unobserve(element);
      }
    });
  }

  /**
   * Handle page visibility changes
   */
  function handlePageVisible() {
    // Resume animations if needed
  }

  /**
   * Handle page hidden
   */
  function handlePageHidden() {
    // Pause animations if needed
  }

  /**
   * Handle theme changes
   */
  function handleThemeChange() {
    // Update any theme-specific animations
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    // Recalculate parallax positions
    updateParallaxElements();
  }

  // ================================
  // ANIMATION TRIGGER FUNCTIONS
  // ================================

  /**
   * Trigger reveal animation
   */
  function triggerRevealAnimation(element) {
    if (element.animationData?.hasAnimated) {
      return;
    }

    const animationType = element.animationData?.type || "fade-in";
    const delay = element.animationData?.delay || 0;

    setTimeout(() => {
      element.classList.remove(Animations.classes.hidden);
      element.classList.add(Animations.classes.visible);
      element.classList.add(Animations.classes[animationType.replace("-", "")]);

      // Mark as animated
      if (element.animationData) {
        element.animationData.hasAnimated = true;
      }

      // Dispatch event
      element.dispatchEvent(
        new CustomEvent("animate:reveal", {
          detail: { type: animationType },
        })
      );
    }, delay);
  }

  /**
   * Trigger counter animation
   */
  function triggerCounterAnimation(element) {
    if (element.counterData?.hasAnimated) {
      return;
    }

    const data = element.counterData;
    if (!data) return;

    const startTime = performance.now();
    const startValue = data.start;
    const endValue = data.target;
    const duration = data.duration;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutCubic for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easedProgress
      );

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Animation complete
        data.hasAnimated = true;
        element.dispatchEvent(
          new CustomEvent("animate:counter", {
            detail: { finalValue: endValue },
          })
        );
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Trigger stagger animation
   */
  function triggerStaggerAnimation(container) {
    if (container.staggerData?.hasAnimated) {
      return;
    }

    const data = container.staggerData;
    if (!data) return;

    data.children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.remove(Animations.classes.hidden);
        child.classList.add(Animations.classes.visible);
        child.classList.add(Animations.classes.stagger);

        // Dispatch event for last child
        if (index === data.children.length - 1) {
          container.dispatchEvent(
            new CustomEvent("animate:stagger", {
              detail: { childrenCount: data.children.length },
            })
          );
        }
      }, index * data.delay);
    });

    data.hasAnimated = true;
  }

  // ================================
  // PARALLAX FUNCTIONS
  // ================================

  /**
   * Update parallax elements
   */
  function updateParallaxElements() {
    if (Animations.state.prefersReducedMotion) {
      return;
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    Animations.state.parallaxElements.forEach((element) => {
      if (!element.parallaxData) return;

      const data = element.parallaxData;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementCenter = elementTop + rect.height / 2;
      const windowCenter = scrollY + window.innerHeight / 2;

      const distance = windowCenter - elementCenter;
      const offset = distance * data.factor;

      let transform = "";

      switch (data.direction) {
        case "up":
          transform = `translateY(${-offset}px)`;
          break;
        case "down":
          transform = `translateY(${offset}px)`;
          break;
        case "left":
          transform = `translateX(${-offset}px)`;
          break;
        case "right":
          transform = `translateX(${offset}px)`;
          break;
        case "scale":
          const scale = 1 + offset * 0.001;
          transform = `scale(${Math.max(0.5, Math.min(1.5, scale))})`;
          break;
      }

      element.style.transform = transform;
    });

    Animations.state.isScrolling = false;
    Animations.state.lastScrollY = scrollY;
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  /**
   * Throttle function for performance
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Disable all animations
   */
  function disableAnimations() {
    document.body.classList.add("animations-disabled");

    // Clear parallax transforms
    Animations.state.parallaxElements.forEach((element) => {
      element.style.transform = "";
    });
  }

  /**
   * Enable animations
   */
  function enableAnimations() {
    document.body.classList.remove("animations-disabled");
  }

  /**
   * Inject animation styles
   */
  function injectAnimationStyles() {
    const styleId = "animation-styles";
    if (document.getElementById(styleId)) return;

    const styles = `
        .animate-hidden {
          opacity: 0;
          visibility: hidden;
        }
        
        .animate-visible {
          opacity: 1;
          visibility: visible;
          transition: all 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
        }
        
        .animate-slide-left {
          animation: slideLeft 0.6s ease-out forwards;
        }
        
        .animate-slide-right {
          animation: slideRight 0.6s ease-out forwards;
        }
        
        .animate-scale-up {
          animation: scaleUp 0.6s ease-out forwards;
        }
        
        .animate-stagger {
          animation: staggerIn 0.4s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Disable animations for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-visible,
          .animate-fade-in,
          .animate-slide-up,
          .animate-slide-down,
          .animate-slide-left,
          .animate-slide-right,
          .animate-scale-up,
          .animate-stagger {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }
        }
        
        /* Animations disabled class */
        .animations-disabled * {
          animation: none !important;
          transition: none !important;
        }
      `;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Animate element manually
   */
  function animateElement(element, animationType = "fade-in", delay = 0) {
    if (Animations.state.prefersReducedMotion) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        element.classList.add(Animations.classes.visible);
        element.classList.add(
          Animations.classes[animationType.replace("-", "")]
        );

        // Resolve after animation duration
        setTimeout(resolve, 600);
      }, delay);
    });
  }

  /**
   * Add new elements to animation system
   */
  function observe(elements) {
    if (!Animations.state.isInitialized) {
      console.warn("Animations not initialized");
      return;
    }

    const elementsArray = Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach((element) => {
      if (element.hasAttribute("data-reveal")) {
        setupRevealAnimation(element);
      } else if (element.hasAttribute("data-counter")) {
        setupCounterAnimation(element);
      } else if (element.hasAttribute("data-parallax")) {
        setupParallaxAnimation(element);
      } else if (element.hasAttribute("data-stagger")) {
        setupStaggerAnimation(element);
      }
    });
  }

  /**
   * Refresh animations (useful after dynamic content changes)
   */
  function refresh() {
    processAnimationElements();
  }

  /**
   * Get animation statistics
   */
  function getStats() {
    return {
      revealElements: document.querySelectorAll(
        Animations.config.revealSelector
      ).length,
      counterElements: document.querySelectorAll(
        Animations.config.counterSelector
      ).length,
      parallaxElements: Animations.state.parallaxElements.length,
      staggerContainers: document.querySelectorAll(
        Animations.config.staggerSelector
      ).length,
      prefersReducedMotion: Animations.state.prefersReducedMotion,
    };
  }

  // ================================
  // INITIALIZATION AND EXPORT
  // ================================

  // Create public API
  const publicAPI = {
    init,
    animate: animateElement,
    observe,
    refresh,
    getStats,

    // State access (read-only)
    getState: () => ({ ...Animations.state }),
    getConfig: () => ({ ...Animations.config }),
  };

  // Export to window
  window.animations = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
