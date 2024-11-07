// assets/js/partners-carousel.js

$(document).ready(function () {
    $(".bp-slider").slick({
      slidesToShow: 6,           // Anzahl der sichtbaren Slides
      slidesToScroll: 1,         // Anzahl der Slides, die beim Scrollen bewegt werden
      autoplay: true,            // Autoplay aktivieren
      autoplaySpeed: 1500,       // Geschwindigkeit des Autoplays in Millisekunden
      arrows: false,             // Pfeile deaktivieren
      dots: false,               // Punkte deaktivieren
      pauseOnHover: false,       // Autoplay beim Hover nicht anhalten
      responsive: [
        {
          breakpoint: 992,        // Ab einer Breite von 992px
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 768,        // Ab einer Breite von 768px
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 576,        // Ab einer Breite von 576px
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,        // Ab einer Breite von 480px
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });
  });
  