(function () {
  // --- Helpers ---
  function ensureVideo(card) {
    const videoSrc = card.getAttribute("data-video");
    if (!videoSrc) return null;

    const thumb = card.querySelector(".trainer-thumb");
    if (!thumb) return null;

    let videoEl = thumb.querySelector("video.hover-video");
    if (!videoEl) {
      videoEl = document.createElement("video");
      videoEl.className = "hover-video";
      videoEl.src = videoSrc;
      videoEl.muted = true;       // Autoplay-Anforderung Mobile
      videoEl.loop = true;
      videoEl.playsInline = true; // iOS
      videoEl.preload = "metadata";
      thumb.appendChild(videoEl);
    }
    return { videoEl, thumb };
  }

  function attachHover(card, videoEl) {
    // Desktop Hover
    card.addEventListener("mouseenter", () => {
      if (videoEl.readyState < 2) videoEl.load();
      videoEl.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      videoEl.pause();
      videoEl.currentTime = 0;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(document.querySelectorAll(".trainer-item[data-video]"));
    if (!cards.length) return;

    // Video-Elemente vorbereiten + Hover binden
    const entries = cards
      .map((card) => {
        const res = ensureVideo(card);
        if (!res) return null;
        attachHover(card, res.videoEl);
        return { card, ...res, timer: null };
      })
      .filter(Boolean);

    // Mobile Autoplay: IntersectionObserver auf .trainer-thumb (stabile sichtbare Fläche)
    if (window.matchMedia("(max-width: 768px)").matches) {
      // Ein Observer für alle -> effizienter
      const observer = new IntersectionObserver(
        (ioEntries) => {
          ioEntries.forEach((e) => {
            // Passenden Eintrag finden
            const item = entries.find((x) => x.thumb === e.target);
            if (!item) return;

            const { videoEl } = item;

            // Sichtbar genug?
            const visible = e.isIntersecting && e.intersectionRatio >= 0.5;

            if (visible) {
              // 0.5s sichtbar → Play
              clearTimeout(item.timer);
              item.timer = setTimeout(() => {
                if (videoEl.readyState < 2) videoEl.load();
                videoEl.play().catch(() => {});
              }, 500);
            } else {
              // Unsichtbar → stoppen + reset
              clearTimeout(item.timer);
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          });
        },
        {
          threshold: 0.5,
          // etwas nachsichtiger unten, falls AOS/Transforms das Layout kurz verschieben
          rootMargin: "0px 0px -10% 0px",
        }
      );

      // Beobachte die sichtbare Bildfläche; funktioniert für Trainer-Seite UND Index
      entries.forEach(({ thumb }) => observer.observe(thumb));
    }
  });
})();
