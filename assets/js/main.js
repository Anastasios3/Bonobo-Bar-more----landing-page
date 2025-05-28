// ==========================================================================
// Main JavaScript for Bonobo Bar & More
// ==========================================================================

(function () {
  "use strict";

  // ==========================================================================
  // State Management
  // ==========================================================================

  const state = {
    theme: localStorage.getItem("theme") || "light",
    language: localStorage.getItem("language") || "en",
    cookiesAccepted: localStorage.getItem("cookiesAccepted") === "true",
  };

  // ==========================================================================
  // Language Data
  // ==========================================================================

  const translations = {
    en: {
      "hero-title": "All-day beachfront experience in Rethymno",
      "hero-subtitle": "From morning coffee to late-night cocktails",
      "btn-contact": "Contact Us",
      "btn-menu": "View Menu",

      "coffee-title": "Coffee & Morning",
      "coffee-subtitle": "Start your day with artisan coffee and fresh treats",
      "coffee-card1-title": "Artisan Coffee",
      "coffee-card1-desc":
        "Expertly crafted espresso drinks using premium beans",
      "coffee-card2-title": "Fresh Pastries",
      "coffee-card2-desc":
        "Daily baked croissants and Mediterranean breakfast treats",
      "coffee-card3-title": "Sea View",
      "coffee-card3-desc":
        "Enjoy your morning coffee with stunning Mediterranean views",

      "drinks-title": "Beer, Wine & Spirits",
      "drinks-subtitle":
        "Curated selection from local and international producers",
      "drinks-card1-title": "Craft Beers",
      "drinks-card1-desc":
        "Local Cretan brews and international craft selections",
      "drinks-card2-title": "Fine Wines",
      "drinks-card2-desc":
        "Carefully selected Greek and international wine list",
      "drinks-card3-title": "Premium Spirits",
      "drinks-card3-desc":
        "Top-shelf spirits and liqueurs from around the world",

      "night-title": "Cocktails & Night Events",
      "night-subtitle": "Signature cocktails and vibrant nightlife",
      "night-card1-title": "Signature Cocktails",
      "night-card1-desc":
        "House specialties with local herbs and fresh ingredients",
      "night-card2-title": "Live Music",
      "night-card2-desc":
        "Regular performances and DJ sets in a vibrant atmosphere",
      "night-card3-title": "Night Vibes",
      "night-card3-desc":
        "Transform from café to buzzing nightspot after sunset",

      "contact-title": "Find Us",
      "contact-address": "Address",
      "contact-phone": "Phone",
      "contact-hours": "Hours",
      "contact-hours-daily": "Daily",
      "contact-social": "Social",

      "footer-rights": "All rights reserved.",
      "footer-tagline": "Your all-day beachfront destination in Rethymno",

      "cookie-text":
        "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
      "cookie-accept": "Accept",
    },
    gr: {
      "hero-title": "Ολοήμερη εμπειρία στην παραλία στο Ρέθυμνο",
      "hero-subtitle": "Από το πρωινό καφέ μέχρι τα βραδινά κοκτέιλ",
      "btn-contact": "Επικοινωνία",
      "btn-menu": "Δείτε το Μενού",

      "coffee-title": "Καφές & Πρωινό",
      "coffee-subtitle":
        "Ξεκινήστε τη μέρα σας με καφέ τέχνης και φρέσκα προϊόντα",
      "coffee-card1-title": "Artisan Coffee",
      "coffee-card1-desc":
        "Expertly crafted espresso drinks using premium beans",
      "coffee-card2-title": "Φρέσκα Πρωινά",
      "coffee-card2-desc":
        "Daily baked croissants and Mediterranean breakfast treats",
      "coffee-card3-title": "Θέα στη Θάλασσα",
      "coffee-card3-desc":
        "Enjoy your morning coffee with stunning Mediterranean views",

      "drinks-title": "Μπίρα, Κρασί & Ποτά",
      "drinks-subtitle": "Επιλεγμένη συλλογή από τοπικά και διεθνή ποτά",
      "drinks-card1-title": "Craft Μπίρες",
      "drinks-card1-desc":
        "Local Cretan brews and international craft selections",
      "drinks-card2-title": "Εκλεκτά Κρασιά",
      "drinks-card2-desc":
        "Carefully selected Greek and international wine list",
      "drinks-card3-title": "Premium Ποτά",
      "drinks-card3-desc":
        "Top-shelf spirits and liqueurs from around the world",

      "night-title": "Κοκτέιλ & Βραδινές Εκδηλώσεις",
      "night-subtitle": "Χειροποίητα κοκτέιλ και ζωντανή νυχτερινή ζωή",
      "night-card1-title": "Signature Κοκτέιλ",
      "night-card1-desc":
        "House specialties with local herbs and fresh ingredients",
      "night-card2-title": "Live Μουσική",
      "night-card2-desc":
        "Regular performances and DJ sets in a vibrant atmosphere",
      "night-card3-title": "Νυχτερινές Στιγμές",
      "night-card3-desc":
        "Transform from café to buzzing nightspot after sunset",

      "contact-title": "Επισκεφθείτε μας",
      "contact-address": "Διεύθυνση",
      "contact-phone": "Τηλέφωνο",
      "contact-hours": "Ώρες",
      "contact-hours-daily": "Καθημερινά",
      "contact-social": "Social Media",

      "footer-rights": "Όλα τα δικαιώματα διατηρούνται.",
      "footer-tagline": "Ο ολοήμερος προορισμός σας στην παραλία του Ρεθύμνου",

      "cookie-text":
        "Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας. Συνεχίζοντας την περιήγηση συμφωνείτε με τη χρήση cookies.",
      "cookie-accept": "Αποδοχή",
    },
  };

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const elements = {
    html: document.documentElement,
    themeToggle: document.querySelector("[data-theme-toggle]"),
    langToggle: document.querySelector("[data-lang-toggle]"),
    cookieConsent: document.getElementById("cookie-consent"),
    acceptCookies: document.getElementById("accept-cookies"),
    sunIcon: document.querySelector(".icon-sun"),
    moonIcon: document.querySelector(".icon-moon"),
  };

  // ==========================================================================
  // Theme Management
  // ==========================================================================

  function setTheme(theme) {
    state.theme = theme;
    elements.html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Update icon visibility
    if (theme === "dark") {
      elements.sunIcon.classList.add("hidden");
      elements.moonIcon.classList.remove("hidden");
    } else {
      elements.sunIcon.classList.remove("hidden");
      elements.moonIcon.classList.add("hidden");
    }
  }

  function toggleTheme() {
    const newTheme = state.theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }

  // ==========================================================================
  // Language Management
  // ==========================================================================

  function setLanguage(lang) {
    state.language = lang;
    elements.html.setAttribute("data-lang", lang);
    elements.html.setAttribute("lang", lang);
    localStorage.setItem("language", lang);

    // Update all translatable elements
    document.querySelectorAll("[data-lang-key]").forEach((element) => {
      const key = element.getAttribute("data-lang-key");
      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
  }

  function toggleLanguage() {
    const newLang = state.language === "en" ? "gr" : "en";
    setLanguage(newLang);
  }

  // ==========================================================================
  // Cookie Management
  // ==========================================================================

  function showCookieConsent() {
    if (!state.cookiesAccepted && elements.cookieConsent) {
      elements.cookieConsent.classList.remove("hidden");
    }
  }

  function acceptCookies() {
    state.cookiesAccepted = true;
    localStorage.setItem("cookiesAccepted", "true");
    elements.cookieConsent.classList.add("hidden");
  }

  // ==========================================================================
  // Smooth Scrolling
  // ==========================================================================

  function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      );
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================

  let lastScroll = 0;
  const header = document.getElementById("header");

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  function init() {
    // Set initial theme
    setTheme(state.theme);

    // Set initial language
    setLanguage(state.language);

    // Show cookie consent if needed
    setTimeout(showCookieConsent, 2000);

    // Event listeners
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", toggleTheme);
    }

    if (elements.langToggle) {
      elements.langToggle.addEventListener("click", toggleLanguage);
    }

    if (elements.acceptCookies) {
      elements.acceptCookies.addEventListener("click", acceptCookies);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.getAttribute("href");
        if (target !== "#") {
          smoothScroll(target);
        }
      });
    });

    // Scroll effect
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll(".card, .section-header").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  // ==========================================================================
  // Add visible class styles dynamically
  // ==========================================================================

  const style = document.createElement("style");
  style.textContent = `
      .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .header.scrolled {
        box-shadow: var(--shadow-md);
      }
    `;
  document.head.appendChild(style);

  // ==========================================================================
  // Start the app
  // ==========================================================================

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
