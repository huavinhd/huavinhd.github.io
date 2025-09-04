// Enhanced Glassmorphism Interactions for VaoCa
(function () {
  "use strict";

  // Debounce function for performance
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

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Enhanced Navigation Glass Effects with Fixed Header
  function initGlassNavigation() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    // Enhanced scroll behavior with smooth transitions
    const handleScroll = throttle(() => {
      const scrolled = window.scrollY > 30;
      const scrollPercent = Math.min(window.scrollY / 200, 1);

      if (scrolled) {
        header.classList.add("scrolled");
        // Dynamic opacity and blur based on scroll
        header.style.setProperty(
          "--scroll-opacity",
          Math.min(0.95, 0.8 + scrollPercent * 0.15)
        );
        header.style.setProperty(
          "--scroll-blur",
          `${25 + scrollPercent * 15}px`
        );
      } else {
        header.classList.remove("scrolled");
        header.style.removeProperty("--scroll-opacity");
        header.style.removeProperty("--scroll-blur");
      }

      // Add smooth hide/show on scroll direction
      if (window.scrollY > 100) {
        if (window.scrollY > this.lastScrollY && window.scrollY > 200) {
          header.style.transform = "translateY(-100%)";
        } else {
          header.style.transform = "translateY(0)";
        }
      }
      this.lastScrollY = window.scrollY;
    }, 16);

    // Initialize scroll position tracking
    handleScroll.lastScrollY = 0;

    window.addEventListener("scroll", handleScroll);

    // Initialize on load
    handleScroll();

    // Enhanced mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.querySelector(".mobile-nav-menu");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        const isActive = mobileMenu.classList.toggle("active");
        mobileMenuBtn.setAttribute("aria-expanded", isActive);

        // Enhanced animation
        if (isActive) {
          mobileMenu.style.display = "block";
          setTimeout(() => mobileMenu.classList.add("active"), 10);
        } else {
          mobileMenu.classList.remove("active");
          setTimeout(() => {
            if (!mobileMenu.classList.contains("active")) {
              mobileMenu.style.display = "none";
            }
          }, 400);
        }
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !header.contains(e.target) &&
          mobileMenu.classList.contains("active")
        ) {
          mobileMenu.classList.remove("active");
          mobileMenuBtn.setAttribute("aria-expanded", false);
          setTimeout(() => {
            if (!mobileMenu.classList.contains("active")) {
              mobileMenu.style.display = "none";
            }
          }, 400);
        }
      });
    }
  }

  // Smooth Scrolling with Easing
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const headerHeight = 80; // Account for fixed header
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Intersection Observer for Scroll Animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe glass cards and feature elements
    document
      .querySelectorAll(".glass-card, .glass-feature-card")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
      });
  }

  // Enhanced Glass Card Hover Effects
  function initGlassCardEffects() {
    document.querySelectorAll(".glass-feature-card").forEach((card) => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      };

      const handleMouseLeave = () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      // Add transition
      card.style.transition = "transform 0.3s ease";
    });
  }

  // Glass Button Ripple Effect
  function initGlassButtonEffects() {
    document
      .querySelectorAll(".glass-btn, .glass-btn-primary")
      .forEach((button) => {
        button.addEventListener("click", function (e) {
          const rect = this.getBoundingClientRect();
          const ripple = document.createElement("span");
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.width = ripple.style.height = size + "px";
          ripple.style.left = x + "px";
          ripple.style.top = y + "px";
          ripple.classList.add("ripple");

          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      });
  }

  // Mobile Menu Enhancement
  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("menu-open");

      if (isOpen) {
        mobileMenu.classList.remove("menu-open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      } else {
        mobileMenu.classList.add("menu-open");
        mobileMenuBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
    });

    // Close on overlay click
    const overlay = mobileMenu.querySelector(".absolute");
    if (overlay) {
      overlay.addEventListener("click", () => {
        mobileMenu.classList.remove("menu-open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    }
  }

  // Lazy Loading for Images
  function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Form Validation and Enhancement
  function initFormEnhancements() {
    document.querySelectorAll(".glass-input").forEach((input) => {
      // Focus and blur effects
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
      });

      // Real-time validation
      input.addEventListener("input", function () {
        if (this.validity.valid) {
          this.classList.remove("invalid");
          this.classList.add("valid");
        } else {
          this.classList.remove("valid");
          this.classList.add("invalid");
        }
      });
    });

    // Enhanced form submission
    document.querySelectorAll(".glass-form").forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Add loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang gửi...";
        submitBtn.classList.add("loading");

        // Simulate API call
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.classList.remove("loading");

          // Show success message
          showNotification(
            "Cảm ơn! Thông tin đã được gửi thành công.",
            "success"
          );
          form.reset();
        }, 2000);
      });
    });
  }

  // Notification System
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg glass-card max-w-sm ${
      type === "success" ? "border-green-400" : "border-blue-400"
    }`;
    notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium">${message}</span>
                <button class="ml-3 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                    </svg>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Parallax Effect for Hero Section
  function initParallaxEffects() {
    const handleScroll = throttle(() => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".glass-float");

      parallaxElements.forEach((element) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16);

    window.addEventListener("scroll", handleScroll);
  }

  // Touch-friendly interactions for mobile
  function initTouchInteractions() {
    if ("ontouchstart" in window) {
      document
        .querySelectorAll(".glass-card, .glass-btn")
        .forEach((element) => {
          element.addEventListener("touchstart", function () {
            this.classList.add("touch-active");
          });

          element.addEventListener("touchend", function () {
            setTimeout(() => {
              this.classList.remove("touch-active");
            }, 150);
          });
        });
    }
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Monitor frame rate for animations
    let lastTime = performance.now();
    let frames = 0;

    function checkFrameRate() {
      frames++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));

        // Reduce animations if performance is poor
        if (fps < 30) {
          document.body.classList.add("reduce-animations");
        }

        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(checkFrameRate);
    }

    checkFrameRate();
  }

  // Initialize all features when DOM is ready
  function init() {
    // Core features
    initGlassNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initGlassCardEffects();
    initGlassButtonEffects();
    initMobileMenu();

    // Enhanced features
    initLazyLoading();
    initFormEnhancements();
    initParallaxEffects();
    initTouchInteractions();

    // Performance
    initPerformanceMonitoring();

    console.log("🌟 VaoCa Glassmorphism UI initialized");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Add CSS for ripple effect
  const style = document.createElement("style");
  style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .touch-active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
        
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .reduce-animations * {
            animation-duration: 0.01ms !important;
            animation-delay: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
        
        .glass-input.valid {
            border-color: rgba(34, 197, 94, 0.5);
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        
        .glass-input.invalid {
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);
})();
