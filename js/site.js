(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobile = document.getElementById("menu-mobile");
  const body = document.body;

  const setScrolled = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  const closeMenu = () => {
    if (!toggle || !mobile) return;
    body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    mobile.hidden = true;
  };
  const openMenu = () => {
    body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fermer le menu");
    mobile.hidden = false;
    const first = mobile.querySelector("a");
    if (first) first.focus();
  };
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      if (mobile.hidden) openMenu();
      else closeMenu();
    });
    mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMenu();
  });

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Lightbox */
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  const btnClose = lightbox && lightbox.querySelector(".lightbox-close");
  const btnPrev = lightbox && lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox && lightbox.querySelector(".lightbox-next");
  let index = 0;
  let lastFocus = null;

  const show = (i) => {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    const el = items[index];
    const src = el.getAttribute("data-full");
    const cap = el.getAttribute("data-caption") || "";
    const img = el.querySelector("img");
    lbImg.src = src;
    lbImg.alt = img ? img.alt : cap;
    lbCap.textContent = cap;
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    body.style.overflow = "hidden";
    show(i);
    btnClose.focus();
  };
  const close = () => {
    lightbox.hidden = true;
    body.style.overflow = "";
    lbImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  items.forEach((el, i) => {
    el.addEventListener("click", () => open(i));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });
  if (btnClose) btnClose.addEventListener("click", close);
  if (btnPrev) btnPrev.addEventListener("click", () => show(index - 1));
  if (btnNext) btnNext.addEventListener("click", () => show(index + 1));
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  /* Contact form → mailto + thank-you */
  const form = document.getElementById("formulaire");
  const thanks = document.getElementById("merci");
  if (form && thanks) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nom = (data.get("nom") || "").toString().trim();
      const tel = (data.get("telephone") || "").toString().trim();
      const courriel = (data.get("courriel") || "").toString().trim();
      const type = (data.get("type") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();
      const subject = encodeURIComponent("Demande de projet — " + (type || "Lemelin Gestion Construction"));
      const body = encodeURIComponent(
        "Nom : " + nom + "\nTéléphone : " + tel + "\nCourriel : " + courriel + "\nProjet : " + type + "\n\n" + message
      );
      window.location.href = "mailto:lemelin.gestionconstruction@gmail.com?subject=" + subject + "&body=" + body;
      form.hidden = true;
      thanks.hidden = false;
    });
  }
})();
