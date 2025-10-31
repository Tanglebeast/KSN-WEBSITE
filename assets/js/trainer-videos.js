
(function () {
  function attachHoverVideo(card) {
    const videoSrc = card.getAttribute('data-video');
    if (!videoSrc) return;

    const thumb = card.querySelector('.trainer-thumb');
    if (!thumb) return;

    let videoEl = thumb.querySelector('video.hover-video');

    // Video-Element einmalig erstellen
    if (!videoEl) {
      videoEl = document.createElement('video');
      videoEl.className = 'hover-video';
      videoEl.src = videoSrc;
      videoEl.preload = 'metadata';       // schnellere Hover-Reaktion, wenig Traffic
      videoEl.muted = true;               // Autoplay-Anforderung
      videoEl.loop = true;
      videoEl.playsInline = true;         // iOS
      thumb.appendChild(videoEl);
    }

    // Events
    card.addEventListener('mouseenter', () => {
      // Start erst beim Hover -> spart Bandbreite
      if (videoEl.paused) {
        // in einigen Browsern braucht es .load() vor play() bei erstem Start
        if (videoEl.readyState < 2) videoEl.load();
        videoEl.play().catch(() => {/* ignorieren */});
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!videoEl.paused) videoEl.pause();
      // Optional: zum Zurücksetzen auf Frame 0
      videoEl.currentTime = 0;
    });
  }

  // Initialisieren
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.trainer-item[data-video]').forEach(attachHoverVideo);
  });
})();