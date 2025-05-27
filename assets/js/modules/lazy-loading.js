/**
 * Bonobo Bar & More - Lazy Loading Module
 * Complete lazy loading system for performance optimization
 *
 * Features:
 * - Intersection Observer API for efficient loading
 * - Support for images, videos, and iframes
 * - WebP format detection and optimization
 * - Responsive image loading with srcset
 * - Blur-up technique for better UX
 * - Error handling and fallbacks
 * - Loading animations and states
 * - Performance monitoring and analytics
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const LazyLoading = {
    // Configuration
    config: {
      imageSelector: 'img[data-src], img[loading="lazy"]',
      videoSelector: "video[data-src]",
      iframeSelector: "iframe[data-src]",
      backgroundSelector: "[data-bg]",
      rootMargin: "50px 0px",
      threshold: 0.01,
      enableWebP: true,
      enableBlurUp: true,
      fadeInDuration: 300,
      retryAttempts: 3,
      retryDelay: 1000,
      analyticsEnabled: false,
    },

    // Current state
    state: {
      observer: null,
      loadedImages: new Set(),
      failedImages: new Set(),
      supportsWebP: false,
      supportsIntersectionObserver: false,
      totalImages: 0,
      loadedCount: 0,
      isInitialized: false,
    },

    // Performance tracking
    performance: {
      startTime: null,
      loadTimes: [],
      errors: [],
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize lazy loading
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Check browser support
        checkBrowserSupport();

        // Check WebP support
        checkWebPSupport()
          .then(() => {
            // Initialize intersection observer
            if (LazyLoading.state.supportsIntersectionObserver) {
              initIntersectionObserver();
            }

            // Find and process lazy load elements
            processLazyElements();

            // Setup fallback for unsupported browsers
            if (!LazyLoading.state.supportsIntersectionObserver) {
              setupScrollFallback();
            }

            // Setup event listeners
            setupEventListeners();

            LazyLoading.state.isInitialized = true;
            LazyLoading.performance.startTime = performance.now();

            console.log("Lazy loading initialized:", {
              totalImages: LazyLoading.state.totalImages,
              supportsWebP: LazyLoading.state.supportsWebP,
              supportsIO: LazyLoading.state.supportsIntersectionObserver,
            });

            resolve();
          })
          .catch((error) => {
            console.warn("WebP detection failed:", error);
            // Continue without WebP support
            if (LazyLoading.state.supportsIntersectionObserver) {
              initIntersectionObserver();
            }
            processLazyElements();
            LazyLoading.state.isInitialized = true;
            resolve();
          });
      } catch (error) {
        console.error("Lazy loading initialization failed:", error);
        resolve();
      }
    });
  }

  /**
   * Check browser support for features
   */
  function checkBrowserSupport() {
    LazyLoading.state.supportsIntersectionObserver =
      "IntersectionObserver" in window;
  }

  /**
   * Check WebP support
   */
  function checkWebPSupport() {
    return new Promise((resolve) => {
      if (!LazyLoading.config.enableWebP) {
        LazyLoading.state.supportsWebP = false;
        resolve();
        return;
      }

      const webpTest = new Image();
      webpTest.onload = webpTest.onerror = () => {
        LazyLoading.state.supportsWebP = webpTest.height === 2;
        resolve();
      };
      webpTest.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }

  /**
   * Initialize intersection observer
   */
  function initIntersectionObserver() {
    const options = {
      rootMargin: LazyLoading.config.rootMargin,
      threshold: LazyLoading.config.threshold,
    };

    LazyLoading.state.observer = new IntersectionObserver(
      handleIntersection,
      options
    );
  }

  /**
   * Process all lazy load elements on page
   */
  function processLazyElements() {
    // Count total elements for analytics
    const images = document.querySelectorAll(LazyLoading.config.imageSelector);
    const videos = document.querySelectorAll(LazyLoading.config.videoSelector);
    const iframes = document.querySelectorAll(
      LazyLoading.config.iframeSelector
    );
    const backgrounds = document.querySelectorAll(
      LazyLoading.config.backgroundSelector
    );

    LazyLoading.state.totalImages =
      images.length + videos.length + iframes.length + backgrounds.length;

    // Observe elements if intersection observer is supported
    if (LazyLoading.state.observer) {
      [...images, ...videos, ...iframes, ...backgrounds].forEach((element) => {
        LazyLoading.state.observer.observe(element);
      });
    } else {
      // Fallback: load all elements immediately
      [...images, ...videos, ...iframes, ...backgrounds].forEach((element) => {
        loadElement(element);
      });
    }
  }

  /**
   * Setup scroll-based fallback for unsupported browsers
   */
  function setupScrollFallback() {
    const throttledCheck = throttle(checkElementsInViewport, 250);

    window.addEventListener("scroll", throttledCheck, { passive: true });
    window.addEventListener("resize", throttledCheck, { passive: true });

    // Initial check
    setTimeout(checkElementsInViewport, 100);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Listen for app events
    document.addEventListener("app:visible", handlePageVisible);
    document.addEventListener("app:hidden", handlePageHidden);

    // Listen for theme changes that might affect images
    document.addEventListener("theme:change", handleThemeChange);
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

        // Stop observing this element
        LazyLoading.state.observer.unobserve(element);

        // Load the element
        loadElement(element);
      }
    });
  }

  /**
   * Handle page becoming visible
   */
  function handlePageVisible() {
    // Resume any paused loading operations
    if (LazyLoading.state.observer) {
      // Re-observe any elements that might have been added while page was hidden
      const newElements = document.querySelectorAll(
        "[data-src]:not([data-lazy-loaded])"
      );
      newElements.forEach((element) => {
        LazyLoading.state.observer.observe(element);
      });
    }
  }

  /**
   * Handle page becoming hidden
   */
  function handlePageHidden() {
    // Could pause loading operations here if needed
  }

  /**
   * Handle theme changes
   */
  function handleThemeChange(event) {
    // Re-evaluate images that might have theme-specific sources
    const themeImages = document.querySelectorAll(
      "[data-src-light], [data-src-dark]"
    );
    themeImages.forEach((image) => {
      if (image.hasAttribute("data-lazy-loaded")) {
        loadThemeSpecificImage(image, event.detail.theme);
      }
    });
  }

  // ================================
  // LOADING FUNCTIONS
  // ================================

  /**
   * Load a lazy element
   */
  function loadElement(element) {
    if (
      element.hasAttribute("data-lazy-loaded") ||
      element.hasAttribute("data-lazy-loading")
    ) {
      return;
    }

    element.setAttribute("data-lazy-loading", "true");

    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case "img":
        loadImage(element);
        break;
      case "video":
        loadVideo(element);
        break;
      case "iframe":
        loadIframe(element);
        break;
      default:
        if (element.hasAttribute("data-bg")) {
          loadBackground(element);
        }
        break;
    }
  }

  /**
   * Load image with optimization and error handling
   */
  function loadImage(img) {
    const startTime = performance.now();
    const originalSrc = img.getAttribute("data-src") || img.getAttribute("src");

    if (!originalSrc) {
      markAsLoaded(img);
      return;
    }

    // Check for theme-specific sources
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const themeSrc = img.getAttribute(`data-src-${currentTheme}`);
    let srcToLoad = themeSrc || originalSrc;

    // Optimize for WebP if supported
    if (LazyLoading.state.supportsWebP && LazyLoading.config.enableWebP) {
      srcToLoad = getWebPSource(srcToLoad);
    }

    // Handle responsive images
    const srcset = img.getAttribute("data-srcset");
    const sizes = img.getAttribute("data-sizes");

    // Create new image for preloading
    const imageLoader = new Image();

    // Handle successful load
    imageLoader.onload = () => {
      // Set image sources
      img.src = srcToLoad;

      if (srcset) {
        img.srcset = srcset;
        img.removeAttribute("data-srcset");
      }

      if (sizes) {
        img.sizes = sizes;
        img.removeAttribute("data-sizes");
      }

      // Remove data attributes
      img.removeAttribute("data-src");
      img.removeAttribute("data-src-light");
      img.removeAttribute("data-src-dark");

      // Apply fade-in animation
      if (LazyLoading.config.enableBlurUp) {
        applyFadeInAnimation(img);
      }

      // Mark as loaded
      markAsLoaded(img);

      // Track performance
      const loadTime = performance.now() - startTime;
      trackImageLoad(img, loadTime, true);

      LazyLoading.state.loadedImages.add(img);
    };

    // Handle load error
    imageLoader.onerror = () => {
      handleImageError(img, srcToLoad, startTime);
    };

    // Start loading
    if (srcset) {
      imageLoader.srcset = srcset;
    }
    imageLoader.src = srcToLoad;
  }

  /**
   * Load video element
   */
  function loadVideo(video) {
    const src = video.getAttribute("data-src");
    const poster = video.getAttribute("data-poster");

    if (src) {
      video.src = src;
      video.removeAttribute("data-src");
    }

    if (poster) {
      video.poster = poster;
      video.removeAttribute("data-poster");
    }

    // Handle additional source elements
    const sources = video.querySelectorAll("source[data-src]");
    sources.forEach((source) => {
      source.src = source.getAttribute("data-src");
      source.removeAttribute("data-src");
    });

    video.load();
    markAsLoaded(video);
  }

  /**
   * Load iframe element
   */
  function loadIframe(iframe) {
    const src = iframe.getAttribute("data-src");

    if (src) {
      iframe.src = src;
      iframe.removeAttribute("data-src");
    }

    markAsLoaded(iframe);
  }

  /**
   * Load background image
   */
  function loadBackground(element) {
    const bgSrc = element.getAttribute("data-bg");

    if (!bgSrc) {
      markAsLoaded(element);
      return;
    }

    let srcToLoad = bgSrc;

    // Optimize for WebP if supported
    if (LazyLoading.state.supportsWebP && LazyLoading.config.enableWebP) {
      srcToLoad = getWebPSource(srcToLoad);
    }

    // Preload background image
    const imageLoader = new Image();

    imageLoader.onload = () => {
      element.style.backgroundImage = `url(${srcToLoad})`;
      element.removeAttribute("data-bg");

      if (LazyLoading.config.enableBlurUp) {
        applyFadeInAnimation(element);
      }

      markAsLoaded(element);
    };

    imageLoader.onerror = () => {
      console.warn("Failed to load background image:", srcToLoad);
      markAsLoaded(element);
    };

    imageLoader.src = srcToLoad;
  }

  /**
   * Load theme-specific image
   */
  function loadThemeSpecificImage(img, theme) {
    const themeSrc = img.getAttribute(`data-src-${theme}`);

    if (themeSrc && img.src !== themeSrc) {
      // Create new image for smooth transition
      const imageLoader = new Image();

      imageLoader.onload = () => {
        img.src = themeSrc;
      };

      imageLoader.src = themeSrc;
    }
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  /**
   * Get WebP version of image source
   */
  function getWebPSource(src) {
    if (!src || src.includes(".webp")) {
      return src;
    }

    // Simple WebP conversion for common formats
    const webpSrc = src.replace(/\.(jpe?g|png)$/i, ".webp");

    // Only return WebP source if it's different (indicating conversion occurred)
    return webpSrc !== src ? webpSrc : src;
  }

  /**
   * Apply fade-in animation
   */
  function applyFadeInAnimation(element) {
    element.classList.add("lazy-loading");

    // Force reflow
    element.offsetHeight;

    element.classList.add("lazy-loaded");

    setTimeout(() => {
      element.classList.remove("lazy-loading");
    }, LazyLoading.config.fadeInDuration);
  }

  /**
   * Mark element as loaded
   */
  function markAsLoaded(element) {
    element.setAttribute("data-lazy-loaded", "true");
    element.removeAttribute("data-lazy-loading");

    LazyLoading.state.loadedCount++;

    // Dispatch load event
    element.dispatchEvent(
      new CustomEvent("lazyload", {
        detail: { element },
      })
    );

    // Check if all images are loaded
    if (LazyLoading.state.loadedCount >= LazyLoading.state.totalImages) {
      document.dispatchEvent(
        new CustomEvent("lazyload:complete", {
          detail: {
            totalImages: LazyLoading.state.totalImages,
            loadedCount: LazyLoading.state.loadedCount,
            duration: performance.now() - LazyLoading.performance.startTime,
          },
        })
      );
    }
  }

  /**
   * Handle image loading errors with retry logic
   */
  function handleImageError(img, failedSrc, startTime, attempt = 1) {
    if (attempt < LazyLoading.config.retryAttempts) {
      // Retry loading after delay
      setTimeout(() => {
        const imageLoader = new Image();

        imageLoader.onload = () => {
          img.src = failedSrc;
          markAsLoaded(img);
          trackImageLoad(img, performance.now() - startTime, true);
        };

        imageLoader.onerror = () => {
          handleImageError(img, failedSrc, startTime, attempt + 1);
        };

        imageLoader.src = failedSrc;
      }, LazyLoading.config.retryDelay * attempt);
    } else {
      // All retries failed
      console.warn("Failed to load image after retries:", failedSrc);

      // Try fallback image if available
      const fallbackSrc = img.getAttribute("data-fallback");
      if (fallbackSrc) {
        img.src = fallbackSrc;
      }

      img.classList.add("lazy-error");
      markAsLoaded(img);

      LazyLoading.state.failedImages.add(img);
      trackImageLoad(img, performance.now() - startTime, false);
    }
  }

  /**
   * Track image loading performance
   */
  function trackImageLoad(img, loadTime, success) {
    const data = {
      src: img.src || img.getAttribute("data-src"),
      loadTime,
      success,
      timestamp: Date.now(),
    };

    if (success) {
      LazyLoading.performance.loadTimes.push(data);
    } else {
      LazyLoading.performance.errors.push(data);
    }

    // Send analytics if enabled
    if (LazyLoading.config.analyticsEnabled) {
      sendAnalytics("lazy_load", data);
    }
  }

  /**
   * Check elements in viewport (fallback for browsers without Intersection Observer)
   */
  function checkElementsInViewport() {
    const elements = document.querySelectorAll(
      "[data-src]:not([data-lazy-loaded])"
    );

    elements.forEach((element) => {
      if (isElementInViewport(element)) {
        loadElement(element);
      }
    });
  }

  /**
   * Check if element is in viewport
   */
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    // Parse root margin for accurate calculation
    const margin = parseInt(LazyLoading.config.rootMargin.split("px")[0]);

    return (
      rect.top >= -margin &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight + margin &&
      rect.right <= windowWidth
    );
  }

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
   * Send analytics data (placeholder function)
   */
  function sendAnalytics(event, data) {
    // This would integrate with your analytics service
    console.log("Analytics:", event, data);
  }

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Load all remaining images immediately
   */
  function loadAll() {
    const elements = document.querySelectorAll(
      "[data-src]:not([data-lazy-loaded])"
    );
    elements.forEach((element) => {
      if (LazyLoading.state.observer) {
        LazyLoading.state.observer.unobserve(element);
      }
      loadElement(element);
    });
  }

  /**
   * Add new elements to lazy loading
   */
  function observe(elements) {
    if (!LazyLoading.state.isInitialized) {
      console.warn("Lazy loading not initialized");
      return;
    }

    const elementsArray = Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach((element) => {
      if (LazyLoading.state.observer) {
        LazyLoading.state.observer.observe(element);
      } else {
        // Fallback: check if element is in viewport
        if (isElementInViewport(element)) {
          loadElement(element);
        }
      }
    });

    LazyLoading.state.totalImages += elementsArray.length;
  }

  /**
   * Get loading statistics
   */
  function getStats() {
    return {
      totalImages: LazyLoading.state.totalImages,
      loadedCount: LazyLoading.state.loadedCount,
      failedCount: LazyLoading.state.failedImages.size,
      averageLoadTime:
        LazyLoading.performance.loadTimes.length > 0
          ? LazyLoading.performance.loadTimes.reduce(
              (acc, curr) => acc + curr.loadTime,
              0
            ) / LazyLoading.performance.loadTimes.length
          : 0,
      supportsWebP: LazyLoading.state.supportsWebP,
      supportsIntersectionObserver:
        LazyLoading.state.supportsIntersectionObserver,
    };
  }

  /**
   * Update configuration
   */
  function updateConfig(newConfig) {
    Object.assign(LazyLoading.config, newConfig);
  }

  /**
   * Refresh lazy loading (useful after dynamic content changes)
   */
  function refresh() {
    processLazyElements();
  }

  // ================================
  // CSS INJECTION
  // ================================

  /**
   * Inject CSS for lazy loading animations
   */
  function injectStyles() {
    const styleId = "lazy-loading-styles";
    if (document.getElementById(styleId)) return;

    const styles = `
        .lazy-loading {
          opacity: 0;
          transition: opacity ${LazyLoading.config.fadeInDuration}ms ease-in-out;
        }
        
        .lazy-loaded {
          opacity: 1;
        }
        
        .lazy-error {
          opacity: 0.5;
          filter: grayscale(100%);
        }
        
        [data-src] {
          background-color: #f0f0f0;
        }
        
        [data-theme="dark"] [data-src] {
          background-color: #2a2a2a;
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

  // Inject styles immediately
  if (document.head) {
    injectStyles();
  } else {
    document.addEventListener("DOMContentLoaded", injectStyles);
  }

  // Create public API
  const publicAPI = {
    init,
    loadAll,
    observe,
    refresh,
    getStats,
    updateConfig,

    // State access (read-only)
    getState: () => ({ ...LazyLoading.state }),
    getConfig: () => ({ ...LazyLoading.config }),
  };

  // Export to window
  window.lazyLoading = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
