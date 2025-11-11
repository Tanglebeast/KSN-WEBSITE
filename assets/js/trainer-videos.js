(function () {
  function attachHoverVideo(card) {
    const videoSrc = card.getAttribute("data-video");
    if (!videoSrc) return;

    const thumb = card.querySelector(".trainer-thumb");
    if (!thumb) return;

    let videoEl = thumb.querySelector("video.hover-video");

    if (!videoEl) {
      videoEl = document.createElement("video");
      videoEl.className = "hover-video";
      videoEl.src = videoSrc;
      videoEl.muted = true;
      videoEl.loop = true;
      videoEl.playsInline = true;
      videoEl.preload = "metadata";
      thumb.appendChild(videoEl);
    }

    // Desktop → Hover
    card.addEventListener("mouseenter", () => {
      if (videoEl.readyState < 2) videoEl.load();
      videoEl.play().catch(() => {});
    });

    card.addEventListener("mouseleave", () => {
      videoEl.pause();
      videoEl.currentTime = 0;
    });

    // Mobile → Autoplay nach 0.5s sichtbar
    let visibilityTimer = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;

        if (visible) {
          visibilityTimer = setTimeout(() => {
            if (videoEl.readyState < 2) videoEl.load();
            videoEl.play().catch(() => {});
          }, 500); // 0.5 Sekunden sichtbar → Play
        } else {
          clearTimeout(visibilityTimer);
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      });
    }, {
      threshold: 0.6 // mindestens 60% sichtbar
    });

    // nur auf mobile aktiv
    if (window.matchMedia("(max-width: 768px)").matches) {
      observer.observe(card);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".trainer-item[data-video]").forEach(attachHoverVideo);
  });
})();
