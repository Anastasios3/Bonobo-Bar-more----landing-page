/**
 * BONOBO BAR & MORE — MODERN WEB APPLICATION
 * Cutting-edge Alpine.js implementation with contemporary UX
 */

// Modern translation system
const translations = {
  en: {
    // Navigation
    about: "About",
    menu: "Menu",
    experience: "Experience",
    contact: "Contact",

    // Hero section
    hero: {
      tagline:
        "Where vintage soul meets contemporary edge — Rethymno's most sophisticated beachfront experience.",
      visit: "Visit Us",
      menu: "View Menu",
    },

    // About section
    about: {
      label: "Our Philosophy",
      title: "Crafting Moments, Creating Memories",
      description:
        "Since 2017, we've redefined the all-day experience in Rethymno. Our space evolves from serene morning sanctuary to vibrant evening destination, each moment carefully orchestrated.",
      philosophy:
        "We believe in the power of place — where architecture meets atmosphere, where local traditions embrace global sophistication, where every detail serves the greater experience.",
    },

    // Menu section
    menu: {
      label: "Curated Selection",
      title: "Elevated Experiences",
      subtitle:
        "Each offering tells a story of craftsmanship, quality, and creative passion.",
      viewFull: "Explore Full Menu",
    },

    // Experience section
    experience: {
      label: "Daily Rhythm",
      title: "From Dawn to Midnight",
      description:
        "Our space transforms throughout the day, each moment offering its own unique energy and atmosphere. Experience the full spectrum of Bonobo's personality.",
    },

    // Contact section
    contact: {
      label: "Visit Us",
      title: "Find Your Moment",
    },

    // Footer
    footer: {
      tagline:
        "Creating extraordinary moments on Rethymno's most beautiful beachfront.",
      contact: {
        title: "Connect",
        address: "Eleftheríou Venizélou 47, Rethymno",
        phone: "+30 693 246 7584",
        email: "hello@bonobobar.gr",
      },
      hours: {
        title: "Hours",
        daily: "Every Day",
        time: "9:00 AM — 3:00 AM",
      },
      rights: "All rights reserved.",
      privacy: "Privacy Settings",
    },

    // UI elements
    switchLang: "Switch to Greek",
    switchTheme: "Toggle theme",
  },

  el: {
    // Navigation
    about: "Σχετικά",
    menu: "Μενού",
    experience: "Εμπειρία",
    contact: "Επικοινωνία",

    // Hero section
    hero: {
      tagline:
        "Όπου η vintage ψυχή συναντά τη σύγχρονη αισθητική — η πιο εκλεπτυσμένη παραθαλάσσια εμπειρία του Ρεθύμνου.",
      visit: "Επισκεφθείτε μας",
      menu: "Δείτε το Μενού",
    },

    // About section
    about: {
      label: "Η Φιλοσοφία μας",
      title: "Δημιουργώντας Στιγμές, Χτίζοντας Αναμνήσεις",
      description:
        "Από το 2017, έχουμε επαναπροσδιορίσει την ολοήμερη εμπειρία στο Ρέθυμνο. Ο χώρος μας εξελίσσεται από γαλήνιο πρωινό καταφύγιο σε ζωντανό βραδινό προορισμό.",
      philosophy:
        "Πιστεύουμε στη δύναμη του τόπου — όπου η αρχιτεκτονική συναντά την ατμόσφαιρα, όπου οι τοπικές παραδόσεις αγκαλιάζουν την παγκόσμια εκλέπτυνση.",
    },

    // Menu section
    menu: {
      label: "Επιλεγμένη Συλλογή",
      title: "Εξαιρετικές Εμπειρίες",
      subtitle:
        "Κάθε προσφορά αφηγείται μια ιστορία δεξιοτεχνίας, ποιότητας και δημιουργικού πάθους.",
      viewFull: "Δείτε το Πλήρες Μενού",
    },

    // Experience section
    experience: {
      label: "Καθημερινός Ρυθμός",
      title: "Από την Αυγή μέχρι τα Μεσάνυχτα",
      description:
        "Ο χώρος μας μεταμορφώνεται καθ' όλη τη διάρκεια της ημέρας, κάθε στιγμή προσφέρει τη δική της μοναδική ενέργεια και ατμόσφαιρα.",
    },

    // Contact section
    contact: {
      label: "Επισκεφθείτε μας",
      title: "Βρείτε τη Στιγμή σας",
    },

    // Footer
    footer: {
      tagline:
        "Δημιουργώντας εξαιρετικές στιγμές στην πιο όμορφη παραλία του Ρεθύμνου.",
      contact: {
        title: "Επικοινωνία",
        address: "Ελευθερίου Βενιζέλου 47, Ρέθυμνο",
        phone: "+30 693 246 7584",
        email: "hello@bonobobar.gr",
      },
      hours: {
        title: "Ώρες",
        daily: "Καθημερινά",
        time: "9:00 ΠΜ — 3:00 ΠΜ",
      },
      rights: "Όλα τα δικαιώματα διατηρούνται.",
      privacy: "Ρυθμίσεις Απορρήτου",
    },

    // UI elements
    switchLang: "Αλλαγή σε Αγγλικά",
    switchTheme: "Αλλαγή θέματος",
  },
};

// Application data
const appData = {
  // Navigation items
  navigation: [
    { id: "about", href: "#about", target: "#about", key: "about" },
    { id: "menu", href: "#menu", target: "#menu", key: "menu" },
    {
      id: "experience",
      href: "#experience",
      target: "#experience",
      key: "experience",
    },
    { id: "contact", href: "#contact", target: "#contact", key: "contact" },
  ],

  // Features data
  features: [
    {
      id: "location",
      icon: "🏖️",
      title: { en: "Beachfront Paradise", el: "Παραθαλάσσιος Παράδεισος" },
      description: {
        en: "Prime location on Rethymno's most beautiful stretch of beach with unobstructed Mediterranean views.",
        el: "Προνομιακή τοποθεσία στο πιο όμορφο τμήμα της παραλίας του Ρεθύμνου με ανεμπόδιστη θέα στη Μεσόγειο.",
      },
    },
    {
      id: "experience",
      icon: "🌅",
      title: { en: "All-Day Journey", el: "Ολοήμερο Ταξίδι" },
      description: {
        en: "Seamlessly transition from morning coffee rituals to evening cocktail ceremonies.",
        el: "Απρόσκοπτη μετάβαση από πρωινά τελετουργικά καφέ σε βραδινές τελετές κοκτέιλ.",
      },
    },
    {
      id: "craft",
      icon: "🌿",
      title: { en: "Local Craft", el: "Τοπική Τέχνη" },
      description: {
        en: "Authentic Cretan ingredients meet contemporary culinary techniques.",
        el: "Αυθεντικά κρητικά υλικά συναντούν σύγχρονες γαστρονομικές τεχνικές.",
      },
    },
    {
      id: "culture",
      icon: "🎵",
      title: { en: "Cultural Hub", el: "Πολιτιστικό Κέντρο" },
      description: {
        en: "Regular events, live performances, and curated musical experiences.",
        el: "Τακτικές εκδηλώσεις, ζωντανές παραστάσεις και επιμελημένες μουσικές εμπειρίες.",
      },
    },
  ],

  // Menu items
  menuItems: [
    {
      id: "coffee",
      title: { en: "Coffee & Morning", el: "Καφές & Πρωί" },
      description: {
        en: "Artisan coffee culture",
        el: "Κουλτούρα artisan καφέ",
      },
      image: "./assets/images/coffee-breakfast.jpg",
      highlights: {
        en: [
          "Single-origin espresso",
          "Fresh Mediterranean breakfast",
          "Homemade pastries",
        ],
        el: [
          "Espresso μονής προέλευσης",
          "Φρέσκο μεσογειακό πρωινό",
          "Σπιτικά γλυκίσματα",
        ],
      },
    },
    {
      id: "drinks",
      title: { en: "Wines & Spirits", el: "Κρασιά & Αποστάγματα" },
      description: {
        en: "Curated liquid experiences",
        el: "Επιμελημένες υγρές εμπειρίες",
      },
      image: "./assets/images/beer-wine-spirits.jpg",
      highlights: {
        en: ["Cretan wine selection", "Premium spirits", "Craft beer rotation"],
        el: [
          "Επιλογή κρητικών κρασιών",
          "Premium αποστάγματα",
          "Craft beer rotation",
        ],
      },
    },
    {
      id: "cocktails",
      title: { en: "Cocktails & Evening", el: "Κοκτέιλ & Βράδυ" },
      description: { en: "Mixology as art form", el: "Μιξολογία ως τέχνη" },
      image: "./assets/images/cocktails-events.jpg",
      highlights: {
        en: [
          "Signature creations",
          "Classic interpretations",
          "Local ingredients",
        ],
        el: [
          "Χαρακτηριστικές δημιουργίες",
          "Κλασικές ερμηνείες",
          "Τοπικά υλικά",
        ],
      },
    },
  ],

  // Experience timeline
  experiences: [
    {
      id: "morning",
      time: { en: "9:00 AM", el: "9:00 ΠΜ" },
      title: { en: "Morning Ritual", el: "Πρωινό Τελετουργικό" },
      description: {
        en: "Coffee ceremonies and Mediterranean breakfast in serene beachfront setting.",
        el: "Τελετουργικά καφέ και μεσογειακό πρωινό σε γαλήνιο παραθαλάσσιο περιβάλλον.",
      },
    },
    {
      id: "afternoon",
      time: { en: "2:00 PM", el: "2:00 ΜΜ" },
      title: { en: "Afternoon Flow", el: "Απογευματινή Ροή" },
      description: {
        en: "Light meals, refreshing drinks, and contemplative moments by the sea.",
        el: "Ελαφριά γεύματα, αναζωογονητικά ποτά και στιγμές συλλογισμού δίπλα στη θάλασσα.",
      },
    },
    {
      id: "evening",
      time: { en: "7:00 PM", el: "7:00 ΜΜ" },
      title: { en: "Evening Transformation", el: "Βραδινή Μεταμόρφωση" },
      description: {
        en: "Sophisticated cocktails and elevated atmosphere as day becomes night.",
        el: "Εκλεπτυσμένα κοκτέιλ και υψηλή ατμόσφαιρα καθώς η μέρα γίνεται νύχτα.",
      },
    },
    {
      id: "night",
      time: { en: "10:00 PM", el: "10:00 ΜΜ" },
      title: { en: "Night Energy", el: "Νυχτερινή Ενέργεια" },
      description: {
        en: "Live music, DJ sets, and vibrant social energy until the early hours.",
        el: "Ζωντανή μουσική, DJ sets και ζωντανή κοινωνική ενέργεια μέχρι τις πρώτες ώρες.",
      },
    },
  ],

  // Contact information
  contactInfo: [
    {
      id: "location",
      icon: "📍",
      title: { en: "Location", el: "Τοποθεσία" },
      value: {
        en: "Beachfront, Old Town Rethymno",
        el: "Παραλία, Παλιά Πόλη Ρεθύμνου",
      },
      link: "https://maps.google.com/?q=Bonobo+Bar+Rethymno",
      linkText: { en: "Get Directions", el: "Οδηγίες" },
    },
    {
      id: "phone",
      icon: "📞",
      title: { en: "Reservations", el: "Κρατήσεις" },
      value: "+30 693 246 7584",
      link: "tel:+306932467584",
      linkText: { en: "Call Now", el: "Καλέστε τώρα" },
    },
    {
      id: "hours",
      icon: "🕒",
      title: { en: "Open Daily", el: "Ανοιχτά Καθημερινά" },
      value: { en: "9:00 AM — 3:00 AM", el: "9:00 ΠΜ — 3:00 ΠΜ" },
      link: null,
      linkText: null,
    },
  ],
};

// Alpine.js application
document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    // State
    currentLang: localStorage.getItem("bonobo-lang") || "en",
    currentTheme: localStorage.getItem("bonobo-theme") || "dark",
    scrollY: 0,
    heroLoaded: false,
    mobileMenuOpen: false,

    // Computed properties
    get t() {
      return translations[this.currentLang];
    },

    get isDark() {
      return this.currentTheme === "dark";
    },

    get isMobile() {
      return window.innerWidth < 768;
    },

    get showNav() {
      return this.scrollY > 50;
    },

    get showFab() {
      return this.scrollY > 1000;
    },

    // Data properties
    navigation: appData.navigation,

    get features() {
      return appData.features.map((feature) => ({
        ...feature,
        title: feature.title[this.currentLang],
        description: feature.description[this.currentLang],
      }));
    },

    get menuItems() {
      return appData.menuItems.map((item) => ({
        ...item,
        title: item.title[this.currentLang],
        description: item.description[this.currentLang],
        highlights: item.highlights[this.currentLang],
      }));
    },

    get experiences() {
      return appData.experiences.map((exp) => ({
        ...exp,
        time: exp.time[this.currentLang],
        title: exp.title[this.currentLang],
        description: exp.description[this.currentLang],
      }));
    },

    get contactInfo() {
      return appData.contactInfo.map((contact) => ({
        ...contact,
        title: contact.title[this.currentLang],
        value:
          typeof contact.value === "object"
            ? contact.value[this.currentLang]
            : contact.value,
        linkText: contact.linkText ? contact.linkText[this.currentLang] : null,
      }));
    },

    // Initialization
    init() {
      this.setupTheme();
      this.setupScrollTracking();
      this.setupIntersectionObserver();
      this.setupKeyboardShortcuts();
      this.preloadAssets();

      // Hero animation trigger
      setTimeout(() => {
        this.heroLoaded = true;
      }, 300);

      // Performance monitoring
      this.trackPerformance();

      console.log("🐒 Bonobo Bar — Modern experience initialized");
    },

    // Theme management
    setupTheme() {
      document.documentElement.setAttribute("data-theme", this.currentTheme);
      document.documentElement.setAttribute("lang", this.currentLang);
    },

    toggleTheme() {
      this.currentTheme = this.isDark ? "light" : "dark";
      localStorage.setItem("bonobo-theme", this.currentTheme);
      document.documentElement.setAttribute("data-theme", this.currentTheme);
      this.trackEvent("theme_toggle", { theme: this.currentTheme });
    },

    // Language management
    toggleLanguage() {
      this.currentLang = this.currentLang === "en" ? "el" : "en";
      localStorage.setItem("bonobo-lang", this.currentLang);
      document.documentElement.setAttribute("lang", this.currentLang);
      this.trackEvent("language_change", { language: this.currentLang });
    },

    // Scroll tracking
    setupScrollTracking() {
      const updateScroll = () => {
        this.scrollY = window.scrollY;
      };

      window.addEventListener("scroll", updateScroll, { passive: true });
      updateScroll();
    },

    // Intersection Observer for animations
    setupIntersectionObserver() {
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("animate");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
        );

        // Observe elements after DOM is ready
        this.$nextTick(() => {
          document.querySelectorAll("[x-intersect]").forEach((el) => {
            observer.observe(el);
          });
        });
      }
    },

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        // ESC to close mobile menu
        if (e.key === "Escape" && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }

        // T for theme toggle
        if (e.key === "t" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          this.toggleTheme();
        }

        // L for language toggle
        if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          this.toggleLanguage();
        }
      });
    },

    // Navigation methods
    scrollToSection(target) {
      const element = document.querySelector(target);
      if (element) {
        const offset = 80; // Account for fixed nav
        const elementPosition = element.offsetTop - offset;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });

        this.trackEvent("navigation", { target: target.replace("#", "") });
      }
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.trackEvent("scroll_to_top");
    },

    // Mobile menu
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      document.body.style.overflow = this.mobileMenuOpen ? "hidden" : "";
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
      document.body.style.overflow = "";
    },

    // External actions
    openMenu() {
      window.open(
        "https://anastasios3.github.io/BONOBO_BAR_QRCODE/",
        "_blank",
        "noopener,noreferrer"
      );
      this.trackEvent("menu_open");
    },

    openPrivacy() {
      if (window.bmOpen) {
        window.bmOpen();
      } else {
        console.log("Privacy settings not available yet");
      }
    },

    // Performance and analytics
    preloadAssets() {
      const criticalImages = [
        "./assets/images/coffee-breakfast.jpg",
        "./assets/images/beer-wine-spirits.jpg",
        "./assets/images/cocktails-events.jpg",
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    },

    trackPerformance() {
      if ("performance" in window) {
        window.addEventListener("load", () => {
          requestIdleCallback(() => {
            const perfData = performance.getEntriesByType("navigation")[0];
            if (perfData) {
              const metrics = {
                loadTime: Math.round(
                  perfData.loadEventEnd - perfData.loadEventStart
                ),
                domReady: Math.round(
                  perfData.domContentLoadedEventEnd -
                    perfData.domContentLoadedEventStart
                ),
                firstPaint:
                  performance.getEntriesByType("paint")[0]?.startTime || 0,
              };

              console.log("📊 Performance:", metrics);
              this.trackEvent("performance", metrics);
            }
          });
        });
      }
    },

    trackEvent(name, data = {}) {
      // Analytics integration point
      if (window.gtag && window.Consent?.analytics) {
        window.gtag("event", name, {
          custom_parameter_1: JSON.stringify(data),
          event_category: "bonobo_interaction",
        });
      }

      console.log(`📈 Event: ${name}`, data);
    },

    // Utility methods
    formatPhoneNumber(phone) {
      return phone.replace(/(\+30)(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    },

    copyToClipboard(text) {
      navigator.clipboard?.writeText(text).then(() => {
        console.log("📋 Copied to clipboard:", text);
      });
    },

    // Development helpers
    debugInfo() {
      return {
        language: this.currentLang,
        theme: this.currentTheme,
        scrollY: this.scrollY,
        isMobile: this.isMobile,
        heroLoaded: this.heroLoaded,
      };
    },
  }));
});

// Global utilities
window.BonobobarApp = {
  // Version info
  version: "2.0.0",
  buildDate: new Date().toISOString(),

  // Feature detection
  features: {
    intersectionObserver: "IntersectionObserver" in window,
    webp: (() => {
      const canvas = document.createElement("canvas");
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    })(),
    touchDevice: "ontouchstart" in window,
    prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  },

  // Expose data for debugging
  translations,
  appData,
};

// Error handling
window.addEventListener("error", (event) => {
  console.error("🚨 Application error:", event.error);
  // Send to error tracking service in production
});

// Service Worker registration for PWA features
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    console.log("💾 Service Worker support detected");
    // navigator.serviceWorker.register('./sw.js') when ready
  });
}

// Development mode detection
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  console.log("🛠️ Development mode active");
  window.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.key === "i" && (e.metaKey || e.ctrlKey) && e.shiftKey)
    ) {
      console.log("🐒 Bonobo Debug Info:", window.BonobobarApp);
    }
  });
}

console.log("🚀 Bonobo Bar — Modern experience ready!");
