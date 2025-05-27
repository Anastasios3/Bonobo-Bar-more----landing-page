/**
 * BONOBO BAR & MORE - MAIN APPLICATION SCRIPT
 * Sophisticated Alpine.js implementation with bilingual support
 * Theme switching, smooth interactions, and premium UX
 */

// Content data for bilingual support
const content = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      menu: "Menu",
      events: "Events",
      contact: "Contact",
    },
    hero: {
      title: "Bonobo Bar & More",
      subtitle: "All-Day Beachfront Experience",
      description:
        "Where vintage charm meets modern comfort on the beautiful shores of Rethymno. From artisan coffee at sunrise to craft cocktails under the stars.",
      cta: {
        contact: "Visit Us",
        menu: "View Menu",
      },
    },
    about: {
      title: "Our Story",
      subtitle:
        "A unique blend of Mediterranean hospitality and contemporary design",
      description1:
        "Since 2017, Bonobo Bar has been Rethymno's premier all-day destination, seamlessly transitioning from a relaxed morning café to a vibrant evening cocktail bar.",
      description2:
        "Our vintage-inspired interior with warm lighting and modern touches creates an intimate yet lively atmosphere, while our beachfront terrace offers breathtaking sea views framed by native palm trees.",
      description3:
        "We pride ourselves on using local Cretan ingredients, from homegrown herbs in our signature cocktails to seasonal fruits that inspire our creative mixology.",
      features: [
        {
          title: "Beachfront Location",
          description:
            "Stunning Mediterranean sea views right on Rethymno's beautiful beach promenade.",
          icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        },
        {
          title: "All-Day Experience",
          description:
            "From morning coffee and brunch to evening cocktails and late-night entertainment.",
          icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
        },
        {
          title: "Local Ingredients",
          description:
            "Authentic Cretan flavors with locally sourced herbs, honey, and seasonal fruits.",
          icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        },
        {
          title: "Live Entertainment",
          description:
            "Regular DJ nights, live music, and themed events featuring electronic and soul music.",
          icon: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
        },
      ],
    },
    menu: {
      title: "Our Offerings",
      subtitle:
        "From sunrise coffee to midnight cocktails, discover our carefully crafted selections",
      coffee: {
        title: "Coffee & Breakfast",
        description:
          "Start your day with our expertly brewed coffee and delicious breakfast options.",
        highlights: [
          "Artisan espresso & specialty coffee drinks",
          "Fresh pastries & Mediterranean breakfast",
          "Homemade pancakes & healthy options",
          "Complimentary treats with morning coffee",
        ],
      },
      drinks: {
        title: "Beer, Wine & Spirits",
        description:
          "Carefully curated selection of local and international beverages.",
        highlights: [
          "Local Greek wines & Cretan varietals",
          "Craft beers & international selections",
          "Premium spirits & aged selections",
          "Wine pairings with local cheese & olives",
        ],
      },
      cocktails: {
        title: "Cocktails & Night Events",
        description:
          "Handcrafted cocktails and vibrant nightlife entertainment.",
        highlights: [
          "Signature cocktails with local ingredients",
          "Classic & contemporary mixology",
          "Live DJ sets & themed parties",
          "Late-night atmosphere until 3 AM",
        ],
      },
      viewFullMenu: "View Full Menu",
    },
    events: {
      title: "Events & Entertainment",
      subtitle:
        "Experience the vibrant nightlife and special events that make Bonobo unique",
      description:
        "Our programming transforms throughout the week, from relaxed brunch sessions to energetic DJ nights. We host regular themed events, live music performances, and special celebrations that bring together locals and visitors in our unique beachfront setting.",
      items: [
        {
          time: "Daily 9AM-3PM",
          title: "All-Day Café Service",
          description:
            "Coffee, brunch, and light meals in a relaxed beachfront atmosphere with soft lounge music.",
        },
        {
          time: "Evenings 6PM+",
          title: "Cocktail Hour",
          description:
            "Transition to evening mode with craft cocktails and a more vibrant social atmosphere.",
        },
        {
          time: "Weekend Nights",
          title: "Live DJ Sets",
          description:
            "Electronic, soul, and Afro-house music with local and guest DJs creating the perfect beach party vibe.",
        },
        {
          time: "Special Events",
          title: "Themed Nights",
          description:
            "Seasonal celebrations, wine tastings, and exclusive parties featuring the best of Cretan hospitality.",
        },
      ],
    },
    contact: {
      title: "Visit Us",
      subtitle: "Find us on the beautiful beachfront of Rethymno's Old Town",
      location: {
        title: "Location",
        address: "Eleftheríou Venizélou 47, Rethymno 74100, Crete, Greece",
      },
      phone: {
        title: "Phone",
        number: "+30 693 246 7584",
      },
      hours: {
        title: "Hours",
        time: "Daily 9:00 AM - 3:00 AM",
      },
    },
    footer: {
      description:
        "Experience the perfect blend of vintage charm and modern comfort at Rethymno's premier beachfront destination.",
      contact: {
        title: "Contact",
        phone: "+30 693 246 7584",
        email: "info@bonobobar.gr",
        address: "Eleftheríou Venizélou 47, Rethymno",
      },
      hours: {
        title: "Hours",
        daily: "Open Daily",
        time: "9:00 AM - 3:00 AM",
      },
      social: {
        title: "Follow Us",
      },
      rights: "All rights reserved.",
      privacy: "Privacy Settings",
    },
  },
  el: {
    nav: {
      home: "Αρχική",
      about: "Σχετικά",
      menu: "Μενού",
      events: "Εκδηλώσεις",
      contact: "Επικοινωνία",
    },
    hero: {
      title: "Bonobo Bar & More",
      subtitle: "Ολοήμερη Παραθαλάσσια Εμπειρία",
      description:
        "Όπου η vintage γοητεία συναντά τη σύγχρονη άνεση στις όμορφες ακτές του Ρεθύμνου. Από artisan καφέ στην ανατολή μέχρι craft κοκτέιλ κάτω από τα αστέρια.",
      cta: {
        contact: "Επισκεφθείτε μας",
        menu: "Δείτε το Μενού",
      },
    },
    about: {
      title: "Η Ιστορία μας",
      subtitle:
        "Ένας μοναδικός συνδυασμός μεσογειακής φιλοξενίας και σύγχρονου σχεδιασμού",
      description1:
        "Από το 2017, το Bonobo Bar είναι ο κορυφαίος ολοήμερος προορισμός του Ρεθύμνου, που μεταμορφώνεται άψογα από ένα χαλαρό πρωινό καφέ σε ένα ζωντανό βραδινό cocktail bar.",
      description2:
        "Ο vintage εσωτερικός μας χώρος με τον ζεστό φωτισμό και τις μοντέρνες πινελιές δημιουργεί μια ατμόσφαιρα ενόσω οικεία όσο και ζωντανή, ενώ η παραθαλάσσια βεράντα μας προσφέρει εκπληκτική θέα στη θάλασσα πλαισιωμένη από γηγενή φοίνικες.",
      description3:
        "Είμαστε περήφανοι που χρησιμοποιούμε τοπικά κρητικά υλικά, από αυτοφυή βότανα στα χαρακτηριστικά μας κοκτέιλ μέχρι εποχικά φρούτα που εμπνέουν τη δημιουργική μας μιξολογία.",
      features: [
        {
          title: "Παραθαλάσσια Τοποθεσία",
          description:
            "Εκπληκτική θέα στη Μεσόγειο ακριβώς στην όμορφη παραλιακή προμενάντ του Ρεθύμνου.",
          icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        },
        {
          title: "Ολοήμερη Εμπειρία",
          description:
            "Από πρωινό καφέ και brunch μέχρι βραδινά κοκτέιλ και νυχτερινή διασκέδαση.",
          icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
        },
        {
          title: "Τοπικά Υλικά",
          description:
            "Αυθεντικές κρητικές γεύσεις με τοπικά βότανα, μέλι και εποχικά φρούτα.",
          icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        },
        {
          title: "Ζωντανή Διασκέδαση",
          description:
            "Τακτικές βραδιές DJ, ζωντανή μουσική και θεματικές εκδηλώσεις με electronic και soul μουσική.",
          icon: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
        },
      ],
    },
    menu: {
      title: "Η Προσφορά μας",
      subtitle:
        "Από τον καφέ της ανατολής μέχρι τα κοκτέιλ του μεσονυκτίου, ανακαλύψτε τις προσεκτικά επιμελημένες επιλογές μας",
      coffee: {
        title: "Καφές & Πρωινό",
        description:
          "Ξεκινήστε τη μέρα σας με τον expertly ζυθισμένο καφέ και τις νόστιμες επιλογές πρωινού μας.",
        highlights: [
          "Artisan espresso & ειδικά ροφήματα καφέ",
          "Φρέσκα αρτοσκευάσματα & μεσογειακό πρωινό",
          "Σπιτικές τηγανίτες & υγιεινές επιλογές",
          "Δωρεάν λιχουδιές με τον πρωινό καφέ",
        ],
      },
      drinks: {
        title: "Μπίρα, Κρασί & Αποστάγματα",
        description:
          "Προσεκτικά επιμελημένη επιλογή τοπικών και διεθνών ποτών.",
        highlights: [
          "Τοπικά ελληνικά κρασιά & κρητικές ποικιλίες",
          "Craft μπίρες & διεθνείς επιλογές",
          "Premium αποστάγματα & παλαιωμένες επιλογές",
          "Συνδυασμοί κρασιού με τοπικό τυρί & ελιές",
        ],
      },
      cocktails: {
        title: "Κοκτέιλ & Νυχτερινές Εκδηλώσεις",
        description: "Χειροποίητα κοκτέιλ και ζωντανή νυχτερινή διασκέδαση.",
        highlights: [
          "Χαρακτηριστικά κοκτέιλ με τοπικά υλικά",
          "Κλασική & σύγχρονη μιξολογία",
          "Ζωντανά DJ sets & θεματικά πάρτι",
          "Νυχτερινή ατμόσφαιρα μέχρι τις 3 πμ",
        ],
      },
      viewFullMenu: "Δείτε το Πλήρες Μενού",
    },
    events: {
      title: "Εκδηλώσεις & Διασκέδαση",
      subtitle:
        "Ζήστε τη ζωντανή νυχτερινή ζωή και τις ειδικές εκδηλώσεις που κάνουν το Bonobo μοναδικό",
      description:
        "Το πρόγραμμά μας μεταμορφώνεται καθ' όλη τη διάρκεια της εβδομάδας, από χαλαρές συνεδρίες brunch μέχρι ενεργητικές βραδιές DJ. Φιλοξενούμε τακτικές θεματικές εκδηλώσεις, παραστάσεις ζωντανής μουσικής και ειδικούς εορτασμούς που φέρνουν κοντά ντόπιους και επισκέπτες στο μοναδικό μας παραθαλάσσιο περιβάλλον.",
      items: [
        {
          time: "Καθημερινά 9ΠΜ-3ΜΜ",
          title: "Ολοήμερη Υπηρεσία Καφέ",
          description:
            "Καφές, brunch και ελαφριά γεύματα σε μια χαλαρή παραθαλάσσια ατμόσφαιρα με απαλή lounge μουσική.",
        },
        {
          time: "Βράδια 6ΜΜ+",
          title: "Ώρα Κοκτέιλ",
          description:
            "Μετάβαση στη βραδινή διάθεση με craft κοκτέιλ και μια πιο ζωντανή κοινωνική ατμόσφαιρα.",
        },
        {
          time: "Σαββατοκύριακα",
          title: "Ζωντανά DJ Sets",
          description:
            "Electronic, soul και Afro-house μουσική με τοπικούς και guest DJs που δημιουργούν την τέλεια beach party διάθεση.",
        },
        {
          time: "Ειδικές Εκδηλώσεις",
          title: "Θεματικές Βραδιές",
          description:
            "Εποχιακές γιορτές, γευστικές κρασιού και αποκλειστικά πάρτι με το καλύτερο της κρητικής φιλοξενίας.",
        },
      ],
    },
    contact: {
      title: "Επισκεφθείτε μας",
      subtitle:
        "Θα μας βρείτε στην όμορφη παραλία της Παλιάς Πόλης του Ρεθύμνου",
      location: {
        title: "Τοποθεσία",
        address: "Ελευθερίου Βενιζέλου 47, Ρέθυμνο 74100, Κρήτη, Ελλάδα",
      },
      phone: {
        title: "Τηλέφωνο",
        number: "+30 693 246 7584",
      },
      hours: {
        title: "Ώρες Λειτουργίας",
        time: "Καθημερινά 9:00 ΠΜ - 3:00 ΠΜ",
      },
    },
    footer: {
      description:
        "Ζήστε τον τέλειο συνδυασμό vintage γοητείας και σύγχρονης άνεσης στον κορυφαίο παραθαλάσσιο προορισμό του Ρεθύμνου.",
      contact: {
        title: "Επικοινωνία",
        phone: "+30 693 246 7584",
        email: "info@bonobobar.gr",
        address: "Ελευθερίου Βενιζέλου 47, Ρέθυμνο",
      },
      hours: {
        title: "Ώρες",
        daily: "Ανοιχτά Καθημερινά",
        time: "9:00 ΠΜ - 3:00 ΠΜ",
      },
      social: {
        title: "Ακολουθήστε μας",
      },
      rights: "Όλα τα δικαιώματα διατηρούνται.",
      privacy: "Ρυθμίσεις Απορρήτου",
    },
  },
};

// Alpine.js Store Initialization
document.addEventListener("alpine:init", () => {
  // UI Store for responsive behavior
  Alpine.store("ui", {
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,

    // Update responsiveness on window resize
    updateBreakpoints() {
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      this.isDesktop = window.innerWidth >= 1024;
    },
  });

  // Theme Store
  Alpine.store("theme", {
    current: localStorage.getItem("bonobo-theme") || "light",

    toggle() {
      this.current = this.current === "light" ? "dark" : "light";
      this.apply();
    },

    apply() {
      document.documentElement.setAttribute("data-theme", this.current);
      localStorage.setItem("bonobo-theme", this.current);
    },

    init() {
      this.apply();
    },
  });

  // Language Store
  Alpine.store("language", {
    current: localStorage.getItem("bonobo-language") || "en",

    toggle() {
      this.current = this.current === "en" ? "el" : "en";
      this.apply();
    },

    apply() {
      document.documentElement.setAttribute("lang", this.current);
      localStorage.setItem("bonobo-language", this.current);
    },

    init() {
      this.apply();
    },
  });

  // Navigation Store
  Alpine.store("navigation", {
    isScrolled: false,

    init() {
      this.updateScrollState();
      window.addEventListener("scroll", () => {
        this.updateScrollState();
      });
    },

    updateScrollState() {
      this.isScrolled = window.scrollY > 50;
    },
  });
});

// Main Alpine.js Component
function bonobobar() {
  return {
    // State
    currentLang: Alpine.store("language").current,
    currentTheme: Alpine.store("theme").current,
    showBackToTop: false,
    lastScrollY: 0,

    // Content
    content: content[Alpine.store("language").current],

    // Initialize component
    init() {
      // Initialize stores
      Alpine.store("theme").init();
      Alpine.store("language").init();
      Alpine.store("navigation").init();

      // Update content when language changes
      this.$watch("$store.language.current", (newLang) => {
        this.currentLang = newLang;
        this.content = content[newLang];
      });

      // Update theme when it changes
      this.$watch("$store.theme.current", (newTheme) => {
        this.currentTheme = newTheme;
      });

      // Scroll handling
      this.handleScroll();
      window.addEventListener("scroll", () => this.handleScroll());

      // Resize handling
      window.addEventListener("resize", () => {
        Alpine.store("ui").updateBreakpoints();
      });

      // Smooth scroll polyfill for older browsers
      this.initSmoothScroll();

      // Initialize intersection observer for animations
      this.initScrollAnimations();

      // Preload critical images
      this.preloadImages();

      console.log("🐒 Bonobo Bar website initialized successfully!");
    },

    // Theme Management
    toggleTheme() {
      Alpine.store("theme").toggle();
    },

    // Language Management
    toggleLanguage() {
      Alpine.store("language").toggle();
    },

    // Scroll Management
    handleScroll() {
      const currentScrollY = window.scrollY;

      // Back to top button visibility
      this.showBackToTop = currentScrollY > 300;

      // Update navigation scroll state
      Alpine.store("navigation").updateScrollState();

      this.lastScrollY = currentScrollY;
    },

    // Navigation Methods
    scrollToSection(selector) {
      const element = document.querySelector(selector);
      if (element) {
        const headerHeight = 64; // Height of fixed header
        const targetPosition = element.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    // Smooth scroll polyfill for browsers that don't support it
    initSmoothScroll() {
      // Check if browser supports smooth scrolling
      if (!("scrollBehavior" in document.documentElement.style)) {
        // Import smooth scroll polyfill if needed
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js";
        script.onload = () => {
          window.__forceSmoothScrollPolyfill__ = true;
          window.smoothscroll.polyfill();
        };
        document.head.appendChild(script);
      }
    },

    // Initialize scroll-triggered animations
    initScrollAnimations() {
      if ("IntersectionObserver" in window) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
          ".feature, .menu-card, .event-item, .contact-item"
        );

        animateElements.forEach((el) => {
          el.classList.add("animate-on-scroll");
          observer.observe(el);
        });
      }
    },

    // Preload critical images for better performance
    preloadImages() {
      const criticalImages = [
        "./assets/images/bonobo-hero-desktop.webp",
        "./assets/images/bonobo-hero-mobile.webp",
        "./assets/images/coffee-breakfast.webp",
        "./assets/images/beer-wine-spirits.webp",
        "./assets/images/cocktails-events.webp",
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    },

    // Utility: Format phone number for display
    formatPhone(phone) {
      return phone.replace(/(\+30)(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    },

    // Utility: Open external link safely
    openExternalLink(url) {
      window.open(url, "_blank", "noopener,noreferrer");
    },

    // Contact form handler (if needed later)
    handleContactForm(formData) {
      // This can be expanded to handle contact form submissions
      console.log("Contact form submitted:", formData);
    },

    // Analytics helper (for when analytics are implemented)
    trackEvent(event, properties = {}) {
      // Integration point for analytics
      if (window.gtag) {
        window.gtag("event", event, properties);
      }

      if (window.Consent && window.Consent.analytics) {
        // Only track if analytics consent is given
        console.log("Tracking event:", event, properties);
      }
    },

    // Performance monitoring
    measurePerformance() {
      if ("performance" in window) {
        window.addEventListener("load", () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType("navigation")[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

            console.log("🚀 Page load performance:", {
              loadTime: `${loadTime}ms`,
              domContentLoaded: `${
                perfData.domContentLoadedEventEnd -
                perfData.domContentLoadedEventStart
              }ms`,
              firstPaint:
                performance.getEntriesByType("paint")[0]?.startTime || "N/A",
            });
          }, 0);
        });
      }
    },
  };
}

// CSS Animation Classes (to be added via CSS)
const animationStyles = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .stagger-animation:nth-child(1) { transition-delay: 0.1s; }
    .stagger-animation:nth-child(2) { transition-delay: 0.2s; }
    .stagger-animation:nth-child(3) { transition-delay: 0.3s; }
    .stagger-animation:nth-child(4) { transition-delay: 0.4s; }
  `;

// Inject animation styles
const styleSheet = document.createElement("style");
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Error handling and debugging
window.addEventListener("error", (event) => {
  console.error("JavaScript error:", event.error);

  // In production, you might want to send this to an error tracking service
  if (window.Consent && window.Consent.analytics) {
    // Track errors if analytics consent is given
  }
});

// PWA-like functionality (future enhancement)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker registration can be added here for offline functionality
    console.log("💡 Service worker support detected - ready for PWA features");
  });
}

// Performance monitoring
bonobobar().measurePerformance();

// Export for global access if needed
window.BonobobarApp = { content, bonobobar };

console.log("🍹 Bonobo Bar application loaded successfully!");
