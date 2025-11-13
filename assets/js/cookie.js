// ======================================================================
// COOKIE FUNKTIONEN
// ======================================================================

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 86400000);
        expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const parts = document.cookie.split(";").map(c => c.trim());
    const match = parts.find(c => c.startsWith(nameEQ));
    return match ? decodeURIComponent(match.substring(nameEQ.length)) : null;
}


// ======================================================================
// SKRIPTE NACH KATEGORIE LADEN
// ======================================================================

function loadCategoryScripts(category) {
    document.querySelectorAll(`script[data-category="${category}"]`).forEach(el => {
        const s = document.createElement("script");

        if (el.src) {
            s.src = el.src;
        } else {
            s.textContent = el.textContent;
        }

        document.head.appendChild(s);
    });
}


// ======================================================================
// EINWILLIGUNG ANWENDEN
// ======================================================================

function applyConsent(settings) {

    if (settings.statistics) {
        loadCategoryScripts("statistics");
    }

    if (settings.marketing) {
        loadCategoryScripts("marketing");
    }

    if (settings.personalization) {
        loadCategoryScripts("personalization");
    }
}


// ======================================================================
// EINSTELLUNGEN SPEICHERN
// ======================================================================

function saveCookieSettings() {
    const settings = {
        statistics: document.getElementById("statistic-cookies").checked,
        marketing: document.getElementById("marketing-cookies").checked,
        personalization: document.getElementById("personalization-cookies").checked
    };

    setCookie("cookieSettings", JSON.stringify(settings), 365);

    document.getElementById("cookie-settings").style.display = "none";
    document.getElementById("cookie-banner").style.display = "none";

    applyConsent(settings);

    setTimeout(() => {
        location.reload();
    }, 200);
}


// ======================================================================
// BUTTON: ALLE AKZEPTIEREN
// ======================================================================

document.getElementById("accept-all").addEventListener("click", function () {
    const settings = {
        statistics: true,
        marketing: true,
        personalization: true
    };

    setCookie("cookieSettings", JSON.stringify(settings), 365);

    document.getElementById("cookie-settings").style.display = "none";
    document.getElementById("cookie-banner").style.display = "none";

    applyConsent(settings);
});


// ======================================================================
// BUTTON: ALLE ABLEHNEN
// ======================================================================

document.getElementById("reject-all").addEventListener("click", function () {

    const settings = {
        statistics: false,
        marketing: false,
        personalization: false
    };

    setCookie("cookieSettings", JSON.stringify(settings), 365);

    document.getElementById("cookie-settings").style.display = "none";
    document.getElementById("cookie-banner").style.display = "none";

        setTimeout(() => {
        location.reload();
    }, 200);
    
});


// ======================================================================
// BUTTON: SPEICHERN IN DEN EINSTELLUNGEN
// ======================================================================

document.getElementById("save-settings").addEventListener("click", saveCookieSettings);


// ======================================================================
// BUTTON: EINSTELLUNGEN ÖFFNEN
// ======================================================================

document.getElementById("open-settings").addEventListener("click", () => {
    document.getElementById("cookie-settings").style.display = "block";
});


// ======================================================================
// BEIM LADEN: COOKIE AUSLESEN
// ======================================================================

window.addEventListener("load", () => {

    const saved = getCookie("cookieSettings");

    // Wenn keine Einstellungen vorhanden → Banner anzeigen
    if (!saved) {
        document.getElementById("cookie-banner").style.display = "block";
        return;
    }

    // gespeicherte Einstellungen übernehmen
    try {
        const settings = JSON.parse(saved);

        document.getElementById("statistic-cookies").checked = settings.statistics;
        document.getElementById("marketing-cookies").checked = settings.marketing;
        document.getElementById("personalization-cookies").checked = settings.personalization;

        applyConsent(settings);

    } catch (err) {
        console.error("Cookie parsing error:", err);
        document.getElementById("cookie-banner").style.display = "block";
    }
});


// ======================================================================
// GLOBAL FUNKTION: BANNER MANUELL ÖFFNEN
// ======================================================================

function showCookieBanner() {
    document.getElementById("cookie-banner").style.display = "block";
}
