// Enhanced page functionality with smooth animations
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Detect OS and show appropriate app store buttons
  function detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) {
      return 'android';
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      return 'ios';
    }
    return 'desktop';
  }

  document.getElementById('compose_email')?.addEventListener('click', function (e) {
    e.preventDefault();
    const email = "sales@phanmemtinhluong.com";
    const subject = "Yêu cầu tư vấn HRM";
    const body = "Chào anh/chị,\nTôi muốn được tư vấn thêm về phần mềm chấm công và tính lương Vào Ca.\nXin cảm ơn!";

    // Kiểm tra thiết bị
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let mailtoUrl;
    if (isMobile) {
      // Đối với thiết bị di động, sử dụng mailto: scheme
      mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Nếu là Android, thử mở trong ứng dụng Gmail
      if (/Android/i.test(navigator.userAgent)) {
        mailtoUrl = `googlegmail://co?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
      // Nếu là iOS, thử mở trong ứng dụng Mail
      else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        mailtoUrl = `message://compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    } else {
      // Đối với desktop, sử dụng Gmail web
      mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Mở link email
    window.location.href = mailtoUrl;
  });

  // document.getElementById('contactForm').addEventListener('submit', async function (e) {
  //   e.preventDefault();
  //   var formFields = ['name', 'email', 'phone', 'company', 'content'];

  //   const formData = new FormData(this);
  //   const dataObj = {};

  //   // map message → content
  //   formFields.forEach(field => {
  //     if (field === 'content') {
  //       dataObj['content'] = formData.get('message') || "";
  //     } else {
  //       dataObj[field] = formData.get(field) || "";
  //     }
  //   });

  //   let jsonString = JSON.stringify(dataObj);

  //   const tmpData = {
  //     "user": "adminApi",
  //     "password": "1ECCB611504F591740CFFFF9B46044CBF506A73B965775E6B2EB0088A15FEDDAA485D8790EFE599231C21A10FEF5D67F15F0725B2F56347DB328B3F59C907621",
  //     "name": "sp_ContactCustommer_Update",
  //     "param": ['IDInput2', jsonString]
  //   };

  //   try {
  //     const response = await fetch('https://paradisehrm.com/vietinsoft/api/hpa/Paradise', {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(tmpData)
  //     });

  //     if (!response.ok) throw new Error("HTTP " + response.status);

  //     const result = await response.json();

  //     alert("Gửi liên hệ thành công!");
  //   } catch (err) {

  //   }

  //   const form = e.target;
  //   const data = new FormData(form);

  //   const res = await fetch(form.action, {
  //     method: form.method,
  //     body: data
  //   });

  //   const json = await res.json();

  //   if (json.success) {
  //     form.reset();
  //   }
  // });

  document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;

    // ====== Tạo object để gửi API nội bộ ======
    var formFields = ['name', 'email', 'phone', 'company', 'content'];
    const formData = new FormData(form);
    const dataObj = {};

    formFields.forEach(field => {
      if (field === 'content') {
        dataObj['content'] = formData.get('message') || "";
      } else {
        dataObj[field] = formData.get(field) || "";
      }
    });

    let jsonString = JSON.stringify(dataObj);

    const tmpData = {
      "user": "adminApi",
      "password": "1ECCB611504F591740CFFFF9B46044CBF506A73B965775E6B2EB0088A15FEDDAA485D8790EFE599231C21A10FEF5D67F15F0725B2F56347DB328B3F59C907621",
      "name": "sp_ContactCustommer_Update",
      "param": ['IDInput2', jsonString]
    };

    try {
      // chạy song song cả 2 promise
      const [apiRes, emailRes] = await Promise.allSettled([
        fetch("https://paradisehrm.com/vietinsoft/api/hpa/Paradise", {
          credentials: "include", // hoặc "same-origin"
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tmpData)
        }),
        fetch(form.action, {
          method: form.method,
          body: formData
        })
      ]);

      let success = false;

      // check API nội bộ
      if (apiRes.status === "fulfilled" && apiRes.value.ok) {
        const apiResult = await apiRes.value.json();
        if (apiResult?.result !== false) success = true;
      }

      // check Web3Forms
      if (emailRes.status === "fulfilled" && emailRes.value.ok) {
        const emailJson = await emailRes.value.json();
        if (emailJson.success) success = true;
      }

      if (success) {
        alert("Gửi liên hệ thành công!");
        form.reset();
      } else {
        throw new Error("Cả API và Email đều lỗi");
      }

    } catch (err) {
      console.error(err);
      alert("Gửi liên hệ thất bại, vui lòng thử lại.");
    }
  });

  // Show/hide app store buttons based on OS
  function updateAppStoreButtons() {
    const os = detectOS();
    const googlePlayBtn = document.getElementById('google-play-btn');
    const appStoreBtn = document.getElementById('app-store-btn');

    if (googlePlayBtn && appStoreBtn) {
      if (os === 'android') {
        googlePlayBtn.style.cssText = 'display: flex !important';
        appStoreBtn.style.cssText = 'display: none !important';
      } else if (os === 'ios') {
        googlePlayBtn.style.cssText = 'display: none !important';
        appStoreBtn.style.cssText = 'display: flex !important';
      } else {
        googlePlayBtn.style.cssText = 'display: flex !important';
        appStoreBtn.style.cssText = 'display: flex !important';
      }
    }
  }

  // Call the function when the page loads
  updateAppStoreButtons();

  // Enhanced header scroll animation
  const header = document.getElementById("siteHeader");
  const scrollIndicator = document.getElementById("scrollIndicator");
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / documentHeight;

    // Update scroll indicator
    if (scrollIndicator) {
      scrollIndicator.style.transform = `scaleX(${scrollProgress})`;
    }

    if (scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Keep header always visible (removed hide/show functionality)
    // Header stays fixed at top during scroll

    lastScrollY = scrollY;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        // Remove active class from all nav links
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });

        // Add active class to clicked link
        this.classList.add("active");

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Add active state on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - header.offsetHeight - 50;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // Add intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".feature-card-modern, .pricing-card-modern, .glass-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // Enhanced mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);

      // Toggle active class instead of inline styles
      if (!isExpanded) {
        mobileMenu.classList.add("active");
      } else {
        mobileMenu.classList.remove("active");
      }
    });

    // Close mobile menu when clicking on nav links
    const mobileNavLinks = mobileMenu.querySelectorAll(".nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
})();

// progressive enhancement: simple form submit handler (demo)
document.querySelectorAll("form").forEach((f) => {
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = f.querySelector('button[type="submit"]');
    if (!btn) return;
    const old = btn.innerHTML;
    btn.innerHTML = "Đang gửi...";
    setTimeout(() => {
      btn.innerHTML = "Gửi liên hệ";
      alert("Gửi thành công");
      f.reset();
    }, 900);
  });
});

/* Internationalization (load translations from /lang/*.json only) */
(function () {
  // runtime translations object populated from external JSON files in /lang
  const translations = {};

  // show a small dismissible warning when the page is opened via file://
  function showFileProtocolWarning() {
    if (document.getElementById("fileProtocolWarning")) return;
    const wrap = document.createElement("div");
    wrap.id = "fileProtocolWarning";
    wrap.style.zIndex = 9999;
    wrap.className =
      "fixed left-4 right-4 top-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-900 shadow";
    wrap.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;">
        <div>
          <strong>Cross-origin blocked:</strong>
          This page was opened using the file:// protocol, so browser fetch() requests to local files (./lang/*.json) are blocked.\n
          Serve the site over HTTP to enable translations and avoid this error.\n
          Try from the project folder in a terminal:\n
          <code style=\"display:block;margin-top:6px;padding:6px;background:#fff;border-radius:4px;color:#111;\">python3 -m http.server 8000</code>
        </div>
        <div style="margin-left:12px;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <button id="dismissFileWarning" style="background:#111;color:#fff;border:none;padding:6px 8px;border-radius:6px;">Đóng</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    document
      .getElementById("dismissFileWarning")
      .addEventListener("click", () => {
        wrap.remove();
      });
  }

  async function loadExternal() {
    // If opened from file://, fetch() to local files will be blocked by browsers.
    if (window.location && window.location.protocol === "file:") {
      // warn the user and skip attempting fetch to avoid noisy errors
      try {
        showFileProtocolWarning();
      } catch (e) { }
      return;
    }
    for (const l of ["vi", "en"]) {
      try {
        const res = await fetch(`./lang/${l}.json`, { cache: "no-cache" });
        if (res.ok) {
          const json = await res.json();
          translations[l] = json;
        }
      } catch (e) {
        // ignore and keep inline
      }
    }
  }

  const getSaved = () => {
    const s = localStorage.getItem("site_lang");
    if (s) return s;
    try {
      return navigator.language && navigator.language.startsWith("en")
        ? "en"
        : "vi";
    } catch (e) {
      return "vi";
    }
  };
  let lang = getSaved();

  // Set selector value
  const sel = document.getElementById("langSelect");
  if (sel) {
    sel.value = lang;
    sel.addEventListener("change", (e) => {
      setLang(e.target.value);
    });
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const txt = (translations[lang] && translations[lang][key]) || "";
      if (txt) {
        el.innerText = txt;
      }
    });

    // update document title / meta description if keys exist
    if (translations[lang] && translations[lang]["meta.title"])
      document.title = translations[lang]["meta.title"];
    if (translations[lang] && translations[lang]["meta.description"]) {
      let m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", translations[lang]["meta.description"]);
    }

    // placeholders -> use explicit data-i18n-placeholder attribute for mapping
    document.querySelectorAll("[data-i18n-placeholder]").forEach((inp) => {
      const key = inp.getAttribute("data-i18n-placeholder");
      const val = (translations[lang] && translations[lang][key]) || "";
      if (val) inp.setAttribute("placeholder", val);
    });

    // update buttons/anchors that use data-i18n
    document
      .querySelectorAll("button[data-i18n], a[data-i18n]")
      .forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const txt = (translations[lang] && translations[lang][key]) || "";
        if (txt) el.innerText = txt;
      });

    // update image alt attributes
    document.querySelectorAll("[data-i18n-alt]").forEach((img) => {
      const key = img.getAttribute("data-i18n-alt");
      const alt = (translations[lang] && translations[lang][key]) || "";
      if (alt) img.setAttribute("alt", alt);
    });
    // ensure brand gradient persists after any text replacement
    try {
      preserveGradientTitle();
    } catch (e) { }
  }

  // ensure the brand wordmark keeps gradient styling even after translations replace innerText
  function preserveGradientTitle() {
    const h = document.querySelector('[data-i18n="hero.title"]');
    if (!h) return;
    // if translations replaced the content, try to wrap the first occurrence of "Vào Ca"
    const text = h.innerText || "";
    if (/Vào\s*Ca/.test(text) && !h.querySelector(".gradient-text")) {
      h.innerHTML = h.innerHTML.replace(
        /(Vào\s*Ca)/,
        '<span class="gradient-text">$1</span>'
      );
    }
  }

  function setLang(l) {
    lang = l;
    localStorage.setItem("site_lang", l);
    applyTranslations();
    if (sel) sel.value = l;
  }

  // initial apply: try loading external files first
  loadExternal()
    .then(() => applyTranslations())
    .catch(() => applyTranslations());
})();

// Mobile menu + sticky header
(function () {
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const header = document.getElementById("siteHeader");
  let mobileMenuEl;

  // create simple off-canvas mobile menu (if not present)
  function ensureMobileMenu() {
    mobileMenuEl = document.getElementById("mobileMenu");
    if (mobileMenuEl) return;
    mobileMenuEl = document.createElement("div");
    mobileMenuEl.id = "mobileMenu";
    // don't remove from DOM; control visibility via .menu-open
    mobileMenuEl.className = "fixed inset-0 z-40";
    mobileMenuEl.innerHTML = `
                <div id="mobileOverlay" class="absolute inset-0 glass-overlay-dark transition-opacity duration-300 opacity-0"></div>
                <div class="absolute right-0 top-0 h-full w-4/5 max-w-xs glass-mobile-menu p-6 shadow-lg overflow-auto transform translate-x-full transition-transform duration-300">
                    <div class="flex items-center justify-between mb-6">
                        <a href="#" class="flex items-center gap-3">${document.querySelector('a[href="#"]')?.innerHTML || ""
      }</a>
                        <button id="mobileCloseBtn" aria-label="Đóng menu" class="p-2 rounded-md glass-btn">✕</button>
                    </div>
                    <nav class="flex flex-col gap-4" aria-label="Mobile navigation">
                        <a href="#features" class="py-3 px-4 glass-btn rounded-lg text-gray-800 hover:text-primary-color transition-colors">Tính năng</a>
                        <a href="#how" class="py-3 px-4 glass-btn rounded-lg text-gray-800 hover:text-primary-color transition-colors">Cách hoạt động</a>
                        <a href="#customers" class="py-3 px-4 glass-btn rounded-lg text-gray-800 hover:text-primary-color transition-colors">Khách hàng</a>
                        <a href="#aboutUs" class="py-3 px-4 glass-btn rounded-lg text-gray-800 hover:text-primary-color transition-colors">Về chúng tôi</a>
                        <a href="#contact" class="mt-4 glass-btn-primary px-6 py-3 rounded-xl text-white font-semibold">Liên hệ</a>
                    </nav>
                </div>
            `;
    document.body.appendChild(mobileMenuEl);
    // initial closed state: ensure pointer-events are off
    mobileMenuEl.classList.remove("menu-open");
  }
  let isMenuOpen = false;

  function openMobile() {
    if (isMenuOpen) return;
    ensureMobileMenu();
    isMenuOpen = true;

    // Show menu with animation
    requestAnimationFrame(() => {
      // document.body.style.overflow = "hidden";
      mobileMenuEl.classList.add("menu-open");
      mobileBtn?.setAttribute("aria-expanded", "true");
    });
  }

  function closeMobile() {
    if (!mobileMenuEl || !isMenuOpen) return;

    isMenuOpen = false;
    mobileMenuEl.classList.remove("menu-open");
    mobileBtn?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    // Delay removing class to allow animation
    setTimeout(() => {
      if (!isMenuOpen) {
        mobileMenuEl.classList.remove("menu-open");
      }
    }, 300);
  }

  document.addEventListener("click", (e) => {
    // Handle menu button click
    if (e.target && (e.target.id === "mobileMenuBtn" || e.target.closest("#mobileMenuBtn"))) {
      if (isMenuOpen) {
        closeMobile();
      } else {
        openMobile();
      }
    }

    // Handle close button and overlay clicks
    if (e.target && (e.target.id === "mobileCloseBtn" || e.target.id === "mobileOverlay")) {
      closeMobile();
    }

    // Close menu when clicking outside
    if (isMenuOpen && !e.target.closest(".mobile-nav-menu") && !e.target.closest("#mobileMenuBtn")) {
      closeMobile();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  // Sticky header for desktop (>= md)
  const mq = window.matchMedia("(min-width: 768px)");
  let lastSticky = false;
  function updateSticky() {
    if (!header) return;
    const should = mq.matches && window.scrollY > 18;
    if (should === lastSticky) return;
    lastSticky = should;
    if (should) {
      const h = header.offsetHeight || 64;
      // remove 'relative' so Tailwind's .relative doesn't override .fixed
      header.classList.remove("relative");
      header.classList.add(
        "fixed",
        "top-0",
        "left-0",
        "right-0",
        "z-50",
        "backdrop-blur",
        "shadow-md"
      );
      // read CSS var --header-bg; fallback to white-ish if not defined
      const rootBg = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-bg")
        .trim();
      document.body.style.paddingTop = h + "px";
    } else {
      // restore 'relative' for the original layout when not sticky
      header.classList.remove(
        "fixed",
        "top-0",
        "left-0",
        "right-0",
        "z-50",
        "backdrop-blur",
        "shadow-md"
      );
      header.classList.add("relative");
      header.style.background = "";
      header.style.backdropFilter = "";
      document.body.style.paddingTop = "";
    }
  }
  window.addEventListener("scroll", updateSticky, { passive: true });
  window.addEventListener("resize", updateSticky);
  updateSticky();
})();
