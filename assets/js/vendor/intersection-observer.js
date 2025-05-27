/**
 * Intersection Observer Polyfill
 * Provides compatibility for older browsers that don't support Intersection Observer API
 *
 * This polyfill enables:
 * - Scroll-triggered animations
 * - Lazy loading functionality
 * - Navigation highlighting
 * - Performance-optimized scroll detection
 *
 * Supports: IE11+, Safari 10+, older Android browsers
 */

(function (window, document) {
  "use strict";

  // Exit early if Intersection Observer is already supported
  if (
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
  ) {
    // Check if isIntersecting is supported (added later to the spec)
    if (!("isIntersecting" in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(
        window.IntersectionObserverEntry.prototype,
        "isIntersecting",
        {
          get: function () {
            return this.intersectionRatio > 0;
          },
        }
      );
    }
    return;
  }

  /**
   * Utility functions
   */
  function getDocumentRect() {
    return {
      top: 0,
      left: 0,
      right: document.documentElement.clientWidth || document.body.clientWidth,
      width: document.documentElement.clientWidth || document.body.clientWidth,
      bottom:
        document.documentElement.clientHeight || document.body.clientHeight,
      height:
        document.documentElement.clientHeight || document.body.clientHeight,
    };
  }

  function getElementRect(element) {
    var rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width || rect.right - rect.left,
      height: rect.height || rect.bottom - rect.top,
    };
  }

  function parseRootMargin(rootMargin) {
    var margins = (rootMargin || "0px").split(/\s+/).map(function (margin) {
      var match = margin.match(/^(-?\d*\.?\d+)(px|%)$/);
      if (!match) {
        throw new Error("Invalid root margin format");
      }
      return {
        value: parseFloat(match[1]),
        unit: match[2],
      };
    });

    // Fill missing values (CSS shorthand behavior)
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];

    return margins;
  }

  function calculateRootRect(root, rootMargin) {
    var rootRect = root ? getElementRect(root) : getDocumentRect();
    var margins = parseRootMargin(rootMargin);

    // Apply root margin
    rootRect.top -=
      margins[0].unit === "px"
        ? margins[0].value
        : (margins[0].value * rootRect.height) / 100;
    rootRect.right +=
      margins[1].unit === "px"
        ? margins[1].value
        : (margins[1].value * rootRect.width) / 100;
    rootRect.bottom +=
      margins[2].unit === "px"
        ? margins[2].value
        : (margins[2].value * rootRect.height) / 100;
    rootRect.left -=
      margins[3].unit === "px"
        ? margins[3].value
        : (margins[3].value * rootRect.width) / 100;

    rootRect.width = rootRect.right - rootRect.left;
    rootRect.height = rootRect.bottom - rootRect.top;

    return rootRect;
  }

  function calculateIntersection(targetRect, rootRect) {
    var intersectionRect = {
      top: Math.max(targetRect.top, rootRect.top),
      left: Math.max(targetRect.left, rootRect.left),
      bottom: Math.min(targetRect.bottom, rootRect.bottom),
      right: Math.min(targetRect.right, rootRect.right),
    };

    intersectionRect.width = Math.max(
      0,
      intersectionRect.right - intersectionRect.left
    );
    intersectionRect.height = Math.max(
      0,
      intersectionRect.bottom - intersectionRect.top
    );

    return intersectionRect.width > 0 && intersectionRect.height > 0
      ? intersectionRect
      : null;
  }

  function calculateIntersectionRatio(intersectionRect, targetRect) {
    if (!intersectionRect) return 0;

    var targetArea = targetRect.width * targetRect.height;
    var intersectionArea = intersectionRect.width * intersectionRect.height;

    return targetArea ? intersectionArea / targetArea : 0;
  }

  function thresholdExceeded(oldRatio, newRatio, thresholds) {
    if (oldRatio === newRatio) return false;

    for (var i = 0; i < thresholds.length; i++) {
      var threshold = thresholds[i];
      if (
        threshold === oldRatio ||
        threshold === newRatio ||
        (oldRatio < threshold && newRatio > threshold) ||
        (oldRatio > threshold && newRatio < threshold)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * IntersectionObserverEntry constructor
   */
  function IntersectionObserverEntry(
    target,
    time,
    rootBounds,
    boundingClientRect,
    intersectionRect,
    isIntersecting,
    intersectionRatio
  ) {
    this.target = target;
    this.time = time;
    this.rootBounds = rootBounds;
    this.boundingClientRect = boundingClientRect;
    this.intersectionRect = intersectionRect;
    this.isIntersecting = isIntersecting;
    this.intersectionRatio = intersectionRatio;
  }

  /**
   * IntersectionObserver constructor
   */
  function IntersectionObserver(callback, opt_options) {
    if (!callback) {
      throw new Error("IntersectionObserver constructor requires a callback");
    }

    var options = opt_options || {};

    this._callback = callback;
    this._root = options.root || null;
    this._rootMargin = options.rootMargin || "0px";
    this._thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold || 0];

    // Validate thresholds
    for (var i = 0; i < this._thresholds.length; i++) {
      if (this._thresholds[i] < 0 || this._thresholds[i] > 1) {
        throw new Error("Threshold values must be between 0 and 1");
      }
    }

    // Sort thresholds for easier processing
    this._thresholds.sort();

    this._observationTargets = [];
    this._queuedEntries = [];
    this._rootMarginValues = parseRootMargin(this._rootMargin);

    // Bind methods to maintain context
    this._checkForIntersections = this._checkForIntersections.bind(this);
    this._throttledCheck = this._throttle(this._checkForIntersections, 100);

    // Set up event listeners
    this._monitoringEvents = false;
    this._monitoringInterval = null;
  }

  /**
   * IntersectionObserver prototype methods
   */
  IntersectionObserver.prototype.observe = function (target) {
    if (!target || target.nodeType !== 1) {
      throw new Error("Target must be an Element");
    }

    // Check if already observing this target
    for (var i = 0; i < this._observationTargets.length; i++) {
      if (this._observationTargets[i].element === target) {
        return;
      }
    }

    var entry = {
      element: target,
      previousThresholdIndex: -1,
      previousIsIntersecting: false,
    };

    this._observationTargets.push(entry);

    if (!this._monitoringEvents) {
      this._startMonitoring();
    }

    // Trigger initial check
    this._checkForIntersections();
  };

  IntersectionObserver.prototype.unobserve = function (target) {
    this._observationTargets = this._observationTargets.filter(function (
      entry
    ) {
      return entry.element !== target;
    });

    if (this._observationTargets.length === 0) {
      this._stopMonitoring();
    }
  };

  IntersectionObserver.prototype.disconnect = function () {
    this._observationTargets = [];
    this._stopMonitoring();
  };

  IntersectionObserver.prototype.takeRecords = function () {
    var records = this._queuedEntries.slice();
    this._queuedEntries = [];
    return records;
  };

  IntersectionObserver.prototype._startMonitoring = function () {
    if (this._monitoringEvents) return;

    this._monitoringEvents = true;

    // Monitor scroll and resize events
    if (window.addEventListener) {
      window.addEventListener("scroll", this._throttledCheck, true);
      window.addEventListener("resize", this._throttledCheck, true);
    } else {
      // IE8 support
      window.attachEvent("onscroll", this._throttledCheck);
      window.attachEvent("onresize", this._throttledCheck);
    }

    // Fallback polling for cases where events might not fire
    this._monitoringInterval = setInterval(this._checkForIntersections, 100);
  };

  IntersectionObserver.prototype._stopMonitoring = function () {
    if (!this._monitoringEvents) return;

    this._monitoringEvents = false;

    if (window.removeEventListener) {
      window.removeEventListener("scroll", this._throttledCheck, true);
      window.removeEventListener("resize", this._throttledCheck, true);
    } else {
      // IE8 support
      window.detachEvent("onscroll", this._throttledCheck);
      window.detachEvent("onresize", this._throttledCheck);
    }

    if (this._monitoringInterval) {
      clearInterval(this._monitoringInterval);
      this._monitoringInterval = null;
    }
  };

  IntersectionObserver.prototype._checkForIntersections = function () {
    var rootRect = calculateRootRect(this._root, this._rootMargin);
    var entries = [];

    for (var i = 0; i < this._observationTargets.length; i++) {
      var observation = this._observationTargets[i];
      var target = observation.element;

      // Skip if element is not connected to the DOM
      if (
        !target.ownerDocument ||
        !target.ownerDocument.body.contains(target)
      ) {
        continue;
      }

      var targetRect = getElementRect(target);
      var intersectionRect = calculateIntersection(targetRect, rootRect);
      var intersectionRatio = calculateIntersectionRatio(
        intersectionRect,
        targetRect
      );
      var isIntersecting = intersectionRatio > 0;

      // Determine threshold index
      var thresholdIndex = -1;
      for (var j = 0; j < this._thresholds.length; j++) {
        if (intersectionRatio >= this._thresholds[j]) {
          thresholdIndex = j;
        }
      }

      // Check if we should trigger a callback
      var triggerCallback =
        thresholdIndex !== observation.previousThresholdIndex ||
        isIntersecting !== observation.previousIsIntersecting ||
        intersectionRatio === 0;

      if (triggerCallback) {
        var entry = new IntersectionObserverEntry(
          target,
          Date.now(),
          rootRect,
          targetRect,
          intersectionRect,
          isIntersecting,
          intersectionRatio
        );

        entries.push(entry);

        observation.previousThresholdIndex = thresholdIndex;
        observation.previousIsIntersecting = isIntersecting;
      }
    }

    if (entries.length) {
      this._callback(entries, this);
    }
  };

  IntersectionObserver.prototype._throttle = function (func, delay) {
    var timeoutId;
    var lastExecTime = 0;

    return function () {
      var context = this;
      var args = arguments;
      var currentTime = Date.now();

      function execute() {
        lastExecTime = currentTime;
        func.apply(context, args);
      }

      if (currentTime - lastExecTime > delay) {
        execute();
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(execute, delay - (currentTime - lastExecTime));
      }
    };
  };

  // Define the polyfill
  window.IntersectionObserver = IntersectionObserver;
  window.IntersectionObserverEntry = IntersectionObserverEntry;

  // Add isIntersecting property for consistency
  if (!("isIntersecting" in IntersectionObserverEntry.prototype)) {
    Object.defineProperty(
      IntersectionObserverEntry.prototype,
      "isIntersecting",
      {
        get: function () {
          return this.intersectionRatio > 0;
        },
      }
    );
  }
})(window, document);
