(function () {
  function setupVideo(card) {
    const videoSrc = card.getAttribute("data-video");
    if (!videoSrc) return null;

    const thumb = card.querySelector(".trainer-thumb");
    if (!thumb) return null;

    let videoEl = thumb.querySelector("video.hover-video");

    if (!videoEl) {
      videoEl = document.createElement("video");
      videoEl.className = "hover-video";
      videoEl.src = videoSrc;

      // Autoplay Voraussetzungen (iOS Safari)
      videoEl.muted = true;
      videoEl.loop = true;
      videoEl.playsInline = true;
      videoEl.autoplay = false;

      // iOS Safari Fix – verhindert Fullscreen/Blockierung
      videoEl.setAttribute("controlsList", "nodownload nofullscreen noplaybackrate");
      videoEl.setAttribute("disablePictureInPicture", "true");

      // WICHTIG: preload = auto, sonst lädt Safari das Video nie
      videoEl.preload = "auto";

      thumb.appendChild(videoEl);

      // iOS benötigt ein explizites load()
      videoEl.load();
    }

    return { videoEl, thumb };
  }

  function setupHover(card, videoEl) {
    // Desktop Hover Play
    card.addEventListener("mouseenter", () => {
      videoEl.load();
      setTimeout(() => videoEl.play().catch(() => {}), 50);
    });

    card.addEventListener("mouseleave", () => {
      videoEl.pause();
      videoEl.currentTime = 0;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(document.querySelectorAll(".trainer-item[data-video]"));
    if (!cards.length) return;

    const entries = cards
      .map((card) => {
        const data = setupVideo(card);
        if (!data) return null;
        setupHover(card, data.videoEl);
        return { card, ...data, timer: null };
      })
      .filter(Boolean);

    // Mobile Autoplay
    if (window.matchMedia("(max-width: 768px)").matches) {
      const observer = new IntersectionObserver(
        (obsEntries) => {
          obsEntries.forEach((entry) => {
            const item = entries.find((x) => x.thumb === entry.target);
            if (!item) return;

            const { videoEl } = item;
            const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;

            if (visible) {
              clearTimeout(item.timer);
              item.timer = setTimeout(() => {
                videoEl.load(); // Force iOS to allow autoplay
                setTimeout(() => videoEl.play().catch(() => {}), 50);
              }, 500);
            } else {
              clearTimeout(item.timer);
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -10% 0px", // AOS transform handling
        }
      );

      entries.forEach(({ thumb }) => observer.observe(thumb));
    }
  });
})();
