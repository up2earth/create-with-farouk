/* ========= Script for Create with Farouk 3D prototype =========
   - Preloader using GSAP
   - Background video (1029.mp4) continuous loop
   - Card click -> modal with gallery
   - Click glow/pulse interactions
   - Responsive safe behaviors
================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const preloader = document.getElementById("preloader");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const site = document.getElementById("site");
  const bgVideo = document.getElementById("bgVideo");
  const cards = document.querySelectorAll(".card");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalGrid = document.getElementById("modalGrid");
  const modalClose = document.getElementById("modalClose");
  const yearEl = document.getElementById("year");
  yearEl.textContent = new Date().getFullYear();

  // 🎥 Background video (your file)
  const videos = ["videos/1029.mp4"];
  let currentVideo = 0;

  // Portfolio items (sample)
  const portfolio = {
    character: [
      { type: "image", src: "char-1.jpg", title: "Hero Character" },
      { type: "image", src: "char-2.jpg", title: "Stylized Rig" },
      { type: "video", src: "char-3.mp4", title: "Walk Cycle" }
    ],
    environment: [
      { type: "image", src: "env-1.jpg", title: "Desert Texture" },
      { type: "image", src: "env-2.jpg", title: "Forest Pack" },
      { type: "video", src: "env-3.mp4", title: "Scene Flythrough" }
    ],
    motion: [
      { type: "video", src: "motion-1.mp4", title: "Title Sequence" },
      { type: "video", src: "motion-2.mp4", title: "UI Animation" },
      { type: "image", src: "motion-3.jpg", title: "Explainer Frame" }
    ]
  };

  // ------------------ PRELOADER ------------------
  gsap.to(progressBar, {
    width: "100%",
    duration: 2.2,
    ease: "power2.out",
    onUpdate: function() {
      const w = parseFloat(getComputedStyle(progressBar).width);
      const parentW = progressBar.parentElement.getBoundingClientRect().width || 360;
      const percent = Math.min(100, Math.round((w / parentW) * 100));
      progressText.textContent = percent + "%";
    },
    onComplete: function() {
      gsap.to(preloader, {
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: "power2.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          site.setAttribute("aria-hidden", "false");
          startBackgroundVideo();
          animateEntrance();
        }
      });
    }
  });

  // ------------------ ENTRANCE ANIMATION ------------------
  function animateEntrance() {
    gsap.from(".brand", { y: 20, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".tag", { y: 18, opacity: 0, duration: 0.9, delay: 0.12, ease: "power2.out" });
    gsap.from(".btn", { scale: 0.95, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.2, ease: "back.out(1.2)" });
  }

  // ------------------ BACKGROUND VIDEO ------------------
  function startBackgroundVideo() {
    if (!videos.length) return;

    // Load and fade in the video
    bgVideo.src = videos[currentVideo];
    bgVideo.load();
    bgVideo.muted = true;
    bgVideo.loop = true; // Loop infinitely
    bgVideo.play().catch(() => {});

    // Smooth cinematic fade-in
    gsap.fromTo(bgVideo, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power2.out" });
  }

  // ------------------ MODAL HANDLING ------------------
  cards.forEach(card => {
    card.addEventListener("pointerdown", () => gsap.to(card, { scale: 0.985, duration: 0.08 }));
    card.addEventListener("pointerup", () => gsap.to(card, { scale: 1, duration: 0.12 }));

    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      openModal(cat);
      gsap.fromTo(card, { boxShadow: "0 0 0px rgba(0,0,0,0)" }, { boxShadow: "0 0 50px rgba(0,208,255,0.12)", duration: 0.35, yoyo: true, repeat: 1 });
    });
  });

  function openModal(category) {
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "flex";
    modalTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Works";
    modalGrid.innerHTML = "";

    const items = portfolio[category] || [];
    items.forEach(it => {
      const el = document.createElement("div");
      el.classList.add("item");

      if (it.type === "image") {
        const img = document.createElement("img");
        img.src = it.src;
        img.alt = it.title;
        el.appendChild(img);
      } else if (it.type === "video") {
        const v = document.createElement("video");
        v.src = it.src;
        v.controls = true;
        v.playsInline = true;
        el.appendChild(v);
      }

      const caption = document.createElement("div");
      caption.style.padding = "8px 6px";
      caption.style.color = "var(--muted)";
      caption.textContent = it.title;
      el.appendChild(caption);
      modalGrid.appendChild(el);
    });

    gsap.fromTo(".modal-inner", { scale: 0.98, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
  }

  modalClose.addEventListener("click", () => closeModal());
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  function closeModal() {
    gsap.to(".modal-inner", {
      scale: 0.98,
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        modal.setAttribute("aria-hidden", "true");
        modal.style.display = "none";
        modalGrid.innerHTML = "";
      }
    });
  }

  // ------------------ BUTTON GLOW & SCROLL ------------------
  const joinBtn = document.getElementById("joinBtn");
  const portfolioScroll = document.getElementById("portfolioScroll");

  joinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    pulseElement(joinBtn);
    document.querySelector("#join").scrollIntoView({ behavior: "smooth" });
  });

  portfolioScroll.addEventListener("click", (e) => {
    e.preventDefault();
    pulseElement(portfolioScroll);
    document.querySelector("#portfolio").scrollIntoView({ behavior: "smooth" });
  });

  function pulseElement(el) {
    gsap.fromTo(el, { scale: 1 }, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" });
  }

  // ------------------ CLICK BRIGHTNESS GLOW ------------------
  document.body.addEventListener("click", (e) => {
    const el = e.target.closest(".btn, .card, .social-btn");
    if (!el) return;
    gsap.fromTo(el, { filter: "brightness(1)" }, { filter: "brightness(1.12)", duration: 0.12, yoyo: true, repeat: 1 });
  });

  // ESC closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
