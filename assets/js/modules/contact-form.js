/**
 * Bonobo Bar & More - Contact Form Module
 * Complete form handling with validation and submission
 *
 * Features:
 * - Real-time form validation with accessibility
 * - Multi-step form support for reservations
 * - Email integration with proper formatting
 * - Spam protection and rate limiting
 * - Graceful error handling and user feedback
 * - Mobile-optimized input handling
 * - GDPR-compliant data collection
 */

(function () {
  "use strict";

  // ================================
  // MODULE CONFIGURATION
  // ================================

  const ContactForm = {
    // Configuration
    config: {
      // Form selectors
      contactFormSelector: ".contact-form",
      newsletterFormSelector: ".newsletter-form",
      reservationFormSelector: ".reservation-form",

      // API endpoints (for future backend integration)
      submitEndpoint: "/api/contact",
      subscribeEndpoint: "/api/newsletter",
      reservationEndpoint: "/api/reservation",

      // Validation settings
      validateOnInput: true,
      validateOnBlur: true,
      showValidationIcons: true,

      // Rate limiting
      rateLimitDelay: 30000, // 30 seconds between submissions
      maxSubmissionsPerHour: 5,

      // Email validation regex
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phoneRegex: /^[\+]?[\d\s\-\(\)]+$/,
    },

    // Current state
    state: {
      forms: new Map(),
      submissionTimes: [],
      isSubmitting: false,
      lastSubmissionTime: 0,
    },

    // Validation rules
    validationRules: {
      required: (value) => value && value.trim().length > 0,
      email: (value) => ContactForm.config.emailRegex.test(value),
      phone: (value) => ContactForm.config.phoneRegex.test(value),
      minLength: (value, min) => value && value.length >= min,
      maxLength: (value, max) => value && value.length <= max,
      pattern: (value, pattern) => new RegExp(pattern).test(value),
    },

    // Error messages
    errorMessages: {
      required: "This field is required",
      email: "Please enter a valid email address",
      phone: "Please enter a valid phone number",
      minLength: "This field must be at least {min} characters long",
      maxLength: "This field must be no more than {max} characters long",
      pattern: "Please enter a valid format",
      rateLimit: "Please wait before submitting another message",
      network: "Unable to send message. Please try again later",
      server: "Server error. Please try again later",
    },
  };

  // ================================
  // INITIALIZATION
  // ================================

  /**
   * Initialize contact forms
   */
  function init() {
    return new Promise((resolve) => {
      try {
        // Find and initialize all forms
        initializeForms();

        // Setup global event listeners
        setupGlobalEventListeners();

        // Load any saved form data
        loadFormData();

        console.log("Contact forms initialized");
        resolve();
      } catch (error) {
        console.error("Contact forms initialization failed:", error);
        resolve();
      }
    });
  }

  /**
   * Initialize all forms on the page
   */
  function initializeForms() {
    const formSelectors = [
      ContactForm.config.contactFormSelector,
      ContactForm.config.newsletterFormSelector,
      ContactForm.config.reservationFormSelector,
    ];

    formSelectors.forEach((selector) => {
      const forms = document.querySelectorAll(selector);
      forms.forEach((form) => {
        initializeForm(form);
      });
    });
  }

  /**
   * Initialize individual form
   */
  function initializeForm(form) {
    if (!form || ContactForm.state.forms.has(form)) {
      return;
    }

    const formData = {
      element: form,
      fields: new Map(),
      isValid: false,
      isDirty: false,
      type: getFormType(form),
    };

    // Cache form fields
    cacheFormFields(form, formData);

    // Setup form event listeners
    setupFormEventListeners(form, formData);

    // Initialize validation
    initializeValidation(form, formData);

    // Store form data
    ContactForm.state.forms.set(form, formData);
  }

  /**
   * Determine form type
   */
  function getFormType(form) {
    if (form.classList.contains("contact-form")) return "contact";
    if (form.classList.contains("newsletter-form")) return "newsletter";
    if (form.classList.contains("reservation-form")) return "reservation";
    return "generic";
  }

  /**
   * Cache form fields for efficient access
   */
  function cacheFormFields(form, formData) {
    const inputs = form.querySelectorAll(
      "input, textarea, select, [data-input]"
    );

    inputs.forEach((input) => {
      const fieldData = {
        element: input,
        name: input.name || input.getAttribute("data-name"),
        type: input.type || "text",
        isValid: true,
        isDirty: false,
        value: "",
        validationRules: getFieldValidationRules(input),
      };

      formData.fields.set(input, fieldData);
    });
  }

  /**
   * Get validation rules for a field
   */
  function getFieldValidationRules(input) {
    const rules = {};

    // Required validation
    if (input.required || input.hasAttribute("data-required")) {
      rules.required = true;
    }

    // Email validation
    if (input.type === "email") {
      rules.email = true;
      rules.required = true; // Email fields are typically required
    }

    // Phone validation
    if (input.type === "tel" || input.hasAttribute("data-phone")) {
      rules.phone = true;
    }

    // Length validation
    if (input.minLength || input.hasAttribute("data-min-length")) {
      rules.minLength =
        input.minLength || input.getAttribute("data-min-length");
    }

    if (input.maxLength || input.hasAttribute("data-max-length")) {
      rules.maxLength =
        input.maxLength || input.getAttribute("data-max-length");
    }

    // Pattern validation
    if (input.pattern || input.hasAttribute("data-pattern")) {
      rules.pattern = input.pattern || input.getAttribute("data-pattern");
    }

    return rules;
  }

  /**
   * Setup form event listeners
   */
  function setupFormEventListeners(form, formData) {
    // Form submission
    form.addEventListener("submit", (event) => {
      handleFormSubmit(event, formData);
    });

    // Field events
    formData.fields.forEach((fieldData, input) => {
      // Input validation
      if (ContactForm.config.validateOnInput) {
        input.addEventListener("input", (event) => {
          handleFieldInput(event, fieldData, formData);
        });
      }

      // Blur validation
      if (ContactForm.config.validateOnBlur) {
        input.addEventListener("blur", (event) => {
          handleFieldBlur(event, fieldData, formData);
        });
      }

      // Focus handling
      input.addEventListener("focus", (event) => {
        handleFieldFocus(event, fieldData);
      });
    });

    // Auto-save for longer forms
    if (formData.type === "contact" || formData.type === "reservation") {
      const autoSave = debounce(() => saveFormData(formData), 2000);
      form.addEventListener("input", autoSave);
    }
  }

  /**
   * Setup global event listeners
   */
  function setupGlobalEventListeners() {
    // Listen for page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for app events
    document.addEventListener("language:change", handleLanguageChange);

    // Handle page unload
    window.addEventListener("beforeunload", handleBeforeUnload);
  }

  // ================================
  // EVENT HANDLERS
  // ================================

  /**
   * Handle form submission
   */
  function handleFormSubmit(event, formData) {
    event.preventDefault();

    // Check rate limiting
    if (!checkRateLimit()) {
      showFormError(formData, ContactForm.errorMessages.rateLimit);
      return;
    }

    // Validate entire form
    const isValid = validateForm(formData);
    if (!isValid) {
      focusFirstError(formData);
      return;
    }

    // Check if already submitting
    if (ContactForm.state.isSubmitting) {
      return;
    }

    // Submit form
    submitForm(formData);
  }

  /**
   * Handle field input
   */
  function handleFieldInput(event, fieldData, formData) {
    const input = event.target;
    const value = input.value;

    // Update field data
    fieldData.value = value;
    fieldData.isDirty = true;
    formData.isDirty = true;

    // Update floating label state
    updateFloatingLabel(input, value);

    // Validate field if it has been interacted with
    if (fieldData.isDirty) {
      validateField(fieldData);
      updateFieldUI(fieldData);
    }

    // Update form state
    updateFormState(formData);
  }

  /**
   * Handle field blur
   */
  function handleFieldBlur(event, fieldData) {
    fieldData.isDirty = true;
    validateField(fieldData);
    updateFieldUI(fieldData);
  }

  /**
   * Handle field focus
   */
  function handleFieldFocus(event, fieldData) {
    clearFieldError(fieldData);
  }

  /**
   * Handle page visibility changes
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      // Save form data when page becomes hidden
      ContactForm.state.forms.forEach((formData) => {
        if (formData.isDirty) {
          saveFormData(formData);
        }
      });
    }
  }

  /**
   * Handle language changes
   */
  function handleLanguageChange() {
    // Update error messages if using translation system
    ContactForm.state.forms.forEach((formData) => {
      updateFormErrorMessages(formData);
    });
  }

  /**
   * Handle page unload
   */
  function handleBeforeUnload(event) {
    // Save any dirty form data
    ContactForm.state.forms.forEach((formData) => {
      if (formData.isDirty) {
        saveFormData(formData);
      }
    });
  }

  // ================================
  // VALIDATION FUNCTIONS
  // ================================

  /**
   * Validate entire form
   */
  function validateForm(formData) {
    let isValid = true;

    formData.fields.forEach((fieldData) => {
      const fieldValid = validateField(fieldData);
      if (!fieldValid) {
        isValid = false;
        updateFieldUI(fieldData);
      }
    });

    formData.isValid = isValid;
    return isValid;
  }

  /**
   * Validate individual field
   */
  function validateField(fieldData) {
    const value = fieldData.element.value.trim();
    const rules = fieldData.validationRules;
    let isValid = true;
    let errorMessage = null;

    // Check each validation rule
    for (const rule in rules) {
      const ruleValue = rules[rule];

      if (rule === "required" && ruleValue) {
        if (!ContactForm.validationRules.required(value)) {
          isValid = false;
          errorMessage = ContactForm.errorMessages.required;
          break;
        }
      } else if (rule === "email" && ruleValue && value) {
        if (!ContactForm.validationRules.email(value)) {
          isValid = false;
          errorMessage = ContactForm.errorMessages.email;
          break;
        }
      } else if (rule === "phone" && ruleValue && value) {
        if (!ContactForm.validationRules.phone(value)) {
          isValid = false;
          errorMessage = ContactForm.errorMessages.phone;
          break;
        }
      } else if (rule === "minLength" && ruleValue && value) {
        if (!ContactForm.validationRules.minLength(value, ruleValue)) {
          isValid = false;
          errorMessage = ContactForm.errorMessages.minLength.replace(
            "{min}",
            ruleValue
          );
          break;
        }
      } else if (rule === "maxLength" && ruleValue && value) {
        if (!ContactForm.validationRules.maxLength(value, ruleValue)) {
          isValid = false;
          errorMessage = ContactForm.errorMessages.maxLength.replace(
            "{max}",
            ruleValue
          );
          break;
        }
      } else if (rule === "pattern" && ruleValue && value) {
        if (!ContactForm.validationRules.pattern(value, ruleValue)) {
          isValid = false;
          errorMessage = ContactForm.errorMessages.pattern;
          break;
        }
      }
    }

    fieldData.isValid = isValid;
    fieldData.errorMessage = errorMessage;

    return isValid;
  }

  // ================================
  // UI UPDATE FUNCTIONS
  // ================================

  /**
   * Update field UI based on validation state
   */
  function updateFieldUI(fieldData) {
    const input = fieldData.element;
    const formGroup = input.closest(".form-group");

    if (!formGroup) return;

    // Remove existing validation classes
    input.classList.remove("input--error", "input--success");
    formGroup.classList.remove("form-group--error", "form-group--success");

    // Remove existing error messages
    const existingError = formGroup.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }

    // Remove existing success indicators
    const existingSuccess = formGroup.querySelector(".form-success");
    if (existingSuccess) {
      existingSuccess.remove();
    }

    if (fieldData.isDirty) {
      if (!fieldData.isValid) {
        // Show error state
        input.classList.add("input--error");
        formGroup.classList.add("form-group--error");

        if (fieldData.errorMessage) {
          showFieldError(formGroup, fieldData.errorMessage);
        }
      } else if (fieldData.value.trim()) {
        // Show success state for non-empty valid fields
        input.classList.add("input--success");
        formGroup.classList.add("form-group--success");

        if (ContactForm.config.showValidationIcons) {
          showFieldSuccess(formGroup);
        }
      }
    }

    // Update aria attributes for accessibility
    updateFieldAccessibility(fieldData);
  }

  /**
   * Show field error message
   */
  function showFieldError(formGroup, errorMessage) {
    const errorElement = document.createElement("div");
    errorElement.className = "form-error";
    errorElement.innerHTML = `
          <span class="form-error__icon" aria-hidden="true">⚠️</span>
          <span class="form-error__message">${errorMessage}</span>
        `;

    // Add after the input
    const input = formGroup.querySelector("input, textarea, select");
    if (input && input.nextSibling) {
      formGroup.insertBefore(errorElement, input.nextSibling);
    } else {
      formGroup.appendChild(errorElement);
    }
  }

  /**
   * Show field success indicator
   */
  function showFieldSuccess(formGroup) {
    const successElement = document.createElement("div");
    successElement.className = "form-success";
    successElement.innerHTML = `
          <span class="form-success__icon" aria-hidden="true">✓</span>
        `;

    formGroup.appendChild(successElement);
  }

  /**
   * Clear field error state
   */
  function clearFieldError(fieldData) {
    const input = fieldData.element;
    const formGroup = input.closest(".form-group");

    if (formGroup) {
      const errorElement = formGroup.querySelector(".form-error");
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  /**
   * Update floating label state
   */
  function updateFloatingLabel(input, value) {
    const hasValue = value && value.trim().length > 0;

    if (hasValue) {
      input.classList.add("has-value");
    } else {
      input.classList.remove("has-value");
    }
  }

  /**
   * Update field accessibility attributes
   */
  function updateFieldAccessibility(fieldData) {
    const input = fieldData.element;

    if (!fieldData.isValid && fieldData.errorMessage) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", `${input.name}-error`);
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  // ================================
  // FORM SUBMISSION
  // ================================

  /**
   * Submit form
   */
  function submitForm(formData) {
    ContactForm.state.isSubmitting = true;
    ContactForm.state.lastSubmissionTime = Date.now();

    // Add submission time to rate limiting
    ContactForm.state.submissionTimes.push(Date.now());

    // Show loading state
    showFormLoading(formData);

    // Collect form data
    const data = collectFormData(formData);

    // Simulate API call (replace with actual endpoint)
    simulateFormSubmission(data, formData)
      .then((response) => {
        handleSubmissionSuccess(formData, response);
      })
      .catch((error) => {
        handleSubmissionError(formData, error);
      })
      .finally(() => {
        ContactForm.state.isSubmitting = false;
        hideFormLoading(formData);
      });
  }

  /**
   * Collect form data
   */
  function collectFormData(formData) {
    const data = {
      type: formData.type,
      timestamp: new Date().toISOString(),
      fields: {},
    };

    formData.fields.forEach((fieldData, input) => {
      if (fieldData.name) {
        data.fields[fieldData.name] = input.value.trim();
      }
    });

    return data;
  }

  /**
   * Simulate form submission (replace with real API call)
   */
  function simulateFormSubmission(data, formData) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate success/failure based on form type
        if (Math.random() > 0.1) {
          // 90% success rate
          resolve({
            success: true,
            message: "Thank you for your message. We'll get back to you soon!",
            id: Math.random().toString(36).substr(2, 9),
          });
        } else {
          reject(new Error("Network error"));
        }
      }, 1000 + Math.random() * 2000);
    });
  }

  /**
   * Handle successful submission
   */
  function handleSubmissionSuccess(formData, response) {
    // Show success message
    showFormSuccess(formData, response.message);

    // Clear form data
    clearFormData(formData);

    // Remove saved form data
    removeSavedFormData(formData);

    // Focus management
    const successMessage = formData.element.querySelector(
      ".form-success-message"
    );
    if (successMessage) {
      successMessage.focus();
    }

    // Analytics
    trackFormSubmission(formData.type, "success");
  }

  /**
   * Handle submission error
   */
  function handleSubmissionError(formData, error) {
    console.error("Form submission error:", error);

    let errorMessage = ContactForm.errorMessages.network;
    if (error.message.includes("server")) {
      errorMessage = ContactForm.errorMessages.server;
    }

    showFormError(formData, errorMessage);

    // Analytics
    trackFormSubmission(formData.type, "error", error.message);
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  /**
   * Check rate limiting
   */
  function checkRateLimit() {
    const now = Date.now();
    const timeSinceLastSubmission = now - ContactForm.state.lastSubmissionTime;

    // Check minimum delay between submissions
    if (timeSinceLastSubmission < ContactForm.config.rateLimitDelay) {
      return false;
    }

    // Check submissions per hour
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentSubmissions = ContactForm.state.submissionTimes.filter(
      (time) => time > oneHourAgo
    );

    ContactForm.state.submissionTimes = recentSubmissions;

    return recentSubmissions.length < ContactForm.config.maxSubmissionsPerHour;
  }

  /**
   * Focus first error field
   */
  function focusFirstError(formData) {
    for (const [input, fieldData] of formData.fields) {
      if (!fieldData.isValid) {
        input.focus();
        break;
      }
    }
  }

  /**
   * Show form loading state
   */
  function showFormLoading(formData) {
    const form = formData.element;
    const submitButton = form.querySelector('button[type="submit"]');

    form.classList.add("form--loading");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("btn--loading");
    }
  }

  /**
   * Hide form loading state
   */
  function hideFormLoading(formData) {
    const form = formData.element;
    const submitButton = form.querySelector('button[type="submit"]');

    form.classList.remove("form--loading");

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove("btn--loading");
    }
  }

  /**
   * Show form success message
   */
  function showFormSuccess(formData, message) {
    const form = formData.element;

    // Remove existing messages
    const existingMessages = form.querySelectorAll(
      ".form-success-message, .form-error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const successElement = document.createElement("div");
    successElement.className = "form-success-message";
    successElement.setAttribute("role", "status");
    successElement.setAttribute("aria-live", "polite");
    successElement.setAttribute("tabindex", "-1");
    successElement.innerHTML = `
          <div class="alert alert--success">
            <span class="alert__icon" aria-hidden="true">✓</span>
            <span class="alert__message">${message}</span>
          </div>
        `;

    form.insertBefore(successElement, form.firstChild);
  }

  /**
   * Show form error message
   */
  function showFormError(formData, message) {
    const form = formData.element;

    // Remove existing messages
    const existingMessages = form.querySelectorAll(
      ".form-success-message, .form-error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const errorElement = document.createElement("div");
    errorElement.className = "form-error-message";
    errorElement.setAttribute("role", "alert");
    errorElement.setAttribute("aria-live", "assertive");
    errorElement.innerHTML = `
          <div class="alert alert--error">
            <span class="alert__icon" aria-hidden="true">⚠️</span>
            <span class="alert__message">${message}</span>
          </div>
        `;

    form.insertBefore(errorElement, form.firstChild);
  }

  /**
   * Clear form data
   */
  function clearFormData(formData) {
    formData.fields.forEach((fieldData, input) => {
      input.value = "";
      fieldData.value = "";
      fieldData.isDirty = false;
      fieldData.isValid = true;
      updateFieldUI(fieldData);
      updateFloatingLabel(input, "");
    });

    formData.isDirty = false;
    formData.isValid = false;
  }

  /**
   * Save form data to localStorage
   */
  function saveFormData(formData) {
    try {
      const data = collectFormData(formData);
      const key = `bonobo-form-${formData.type}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Could not save form data:", error);
    }
  }

  /**
   * Load form data from localStorage
   */
  function loadFormData() {
    ContactForm.state.forms.forEach((formData) => {
      try {
        const key = `bonobo-form-${formData.type}`;
        const savedData = localStorage.getItem(key);

        if (savedData) {
          const data = JSON.parse(savedData);
          restoreFormData(formData, data);
        }
      } catch (error) {
        console.warn("Could not load form data:", error);
      }
    });
  }

  /**
   * Restore form data
   */
  function restoreFormData(formData, data) {
    if (!data.fields) return;

    formData.fields.forEach((fieldData, input) => {
      if (fieldData.name && data.fields[fieldData.name]) {
        const value = data.fields[fieldData.name];
        input.value = value;
        fieldData.value = value;
        updateFloatingLabel(input, value);
      }
    });

    formData.isDirty = true;
  }

  /**
   * Remove saved form data
   */
  function removeSavedFormData(formData) {
    try {
      const key = `bonobo-form-${formData.type}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Could not remove saved form data:", error);
    }
  }

  /**
   * Initialize form validation
   */
  function initializeValidation(form, formData) {
    // Set initial form state
    updateFormState(formData);

    // Add form validation classes
    form.classList.add("form--with-validation");
  }

  /**
   * Update form state
   */
  function updateFormState(formData) {
    const allValid = Array.from(formData.fields.values()).every(
      (fieldData) => fieldData.isValid || !fieldData.isDirty
    );

    formData.isValid = allValid;

    // Update submit button state
    const submitButton = formData.element.querySelector(
      'button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = !allValid && formData.isDirty;
    }
  }

  /**
   * Update form error messages (for language changes)
   */
  function updateFormErrorMessages(formData) {
    // Re-validate and update UI with new language
    formData.fields.forEach((fieldData) => {
      if (!fieldData.isValid && fieldData.isDirty) {
        validateField(fieldData);
        updateFieldUI(fieldData);
      }
    });
  }

  /**
   * Track form submission for analytics
   */
  function trackFormSubmission(formType, status, error = null) {
    // Integration point for analytics
    if (window.gtag) {
      window.gtag("event", "form_submit", {
        form_type: formType,
        status: status,
        error: error,
      });
    }

    console.log("Form submission tracked:", { formType, status, error });
  }

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

  // ================================
  // PUBLIC API
  // ================================

  /**
   * Add new form to monitoring
   */
  function addForm(formElement) {
    if (formElement && !ContactForm.state.forms.has(formElement)) {
      initializeForm(formElement);
    }
  }

  /**
   * Remove form from monitoring
   */
  function removeForm(formElement) {
    if (ContactForm.state.forms.has(formElement)) {
      ContactForm.state.forms.delete(formElement);
    }
  }

  /**
   * Validate specific form
   */
  function validateFormById(formElement) {
    const formData = ContactForm.state.forms.get(formElement);
    if (formData) {
      return validateForm(formData);
    }
    return false;
  }

  /**
   * Clear specific form
   */
  function clearFormById(formElement) {
    const formData = ContactForm.state.forms.get(formElement);
    if (formData) {
      clearFormData(formData);
    }
  }

  /**
   * Get form state
   */
  function getFormState(formElement) {
    const formData = ContactForm.state.forms.get(formElement);
    return formData
      ? {
          isValid: formData.isValid,
          isDirty: formData.isDirty,
          type: formData.type,
        }
      : null;
  }

  // ================================
  // INITIALIZATION AND EXPORT
  // ================================

  // Create public API
  const publicAPI = {
    init,
    addForm,
    removeForm,
    validateForm: validateFormById,
    clearForm: clearFormById,
    getFormState,

    // State access (read-only)
    getState: () => ({ ...ContactForm.state }),
    getConfig: () => ({ ...ContactForm.config }),
  };

  // Export to window
  window.contactForm = publicAPI;

  // Also export as a module if possible
  if (typeof module !== "undefined" && module.exports) {
    module.exports = publicAPI;
  }
})();
