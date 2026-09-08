/* Cookie-Hinweis + Google Analytics 4 (nur nach Einwilligung) – MS Heliumtechnik
   Mess-ID hier eintragen, sobald die GA4-Property für helium-leckortung.de angelegt ist.
   Solange die ID leer ist, wird kein Google-Skript geladen; der Hinweis merkt sich nur die Entscheidung. */
(function () {
  var GA_ID = '';                      // z. B. 'G-XXXXXXXXXX'
  var KEY = 'msh_consent';             // localStorage-Schlüssel: 'granted' | 'denied'
  var PRIVACY_URL = '/datenschutz.html';

  var T = {
    de: { text: 'Wir nutzen Google Analytics, um zu verstehen, welche Inhalte für Sie wichtig sind. Das passiert nur, wenn Sie zustimmen. Sie können Ihre Wahl jederzeit in den Cookie-Einstellungen ändern.', more: 'Datenschutz', deny: 'Ablehnen', ok: 'Akzeptieren', settings: 'Cookie-Einstellungen' },
    en: { text: 'We use Google Analytics to understand which content matters to you. This only happens if you agree. You can change your choice at any time in the cookie settings.', more: 'Privacy policy', deny: 'Decline', ok: 'Accept', settings: 'Cookie settings' },
    fr: { text: 'Nous utilisons Google Analytics pour comprendre quels contenus vous intéressent. Cela n’a lieu que si vous l’acceptez. Vous pouvez modifier votre choix à tout moment dans les paramètres des cookies.', more: 'Confidentialité', deny: 'Refuser', ok: 'Accepter', settings: 'Paramètres des cookies' },
    nl: { text: 'Wij gebruiken Google Analytics om te begrijpen welke inhoud voor u belangrijk is. Dit gebeurt alleen als u akkoord gaat. U kunt uw keuze altijd wijzigen in de cookie-instellingen.', more: 'Privacy', deny: 'Weigeren', ok: 'Accepteren', settings: 'Cookie-instellingen' },
    it: { text: 'Utilizziamo Google Analytics per capire quali contenuti sono importanti per voi. Ciò avviene solo con il vostro consenso. Potete modificare la scelta in qualsiasi momento nelle impostazioni dei cookie.', more: 'Privacy', deny: 'Rifiuta', ok: 'Accetta', settings: 'Impostazioni cookie' }
  };

  var CSS = '#msh-consent{position:fixed;left:0;right:0;bottom:0;z-index:2000;background:#0B1F3A;color:#fff;border-top:2px solid #00C4E8;box-shadow:0 -6px 24px rgba(0,0,0,.35);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:1rem 1.25rem}' +
    '#msh-consent .in{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:.9rem 1.5rem}' +
    '#msh-consent p{margin:0;flex:1 1 420px}' +
    '#msh-consent a{color:#00C4E8;text-decoration:underline}' +
    '#msh-consent .btns{display:flex;gap:.6rem;flex-wrap:wrap}' +
    '#msh-consent button{cursor:pointer;border-radius:6px;padding:.6rem 1.2rem;font:inherit;font-weight:600;border:1px solid rgba(255,255,255,.55);background:transparent;color:#fff}' +
    '#msh-consent button.ok{background:#00C4E8;border-color:#00C4E8;color:#0B1F3A}' +
    '#msh-consent button:hover{opacity:.9}' +
    '@media(max-width:600px){#msh-consent .btns{width:100%}#msh-consent button{flex:1}}';

  function getLang() {
    var l = (document.documentElement.getAttribute('lang') || 'de').slice(0, 2).toLowerCase();
    return T[l] ? l : 'de';
  }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || !GA_ID) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  var box = null;
  function privacyLink(t) {
    var modal = document.getElementById('datenschutz-modal');
    if (modal) return '<a href="#" id="msh-consent-privacy">' + t.more + '</a>';
    return '<a href="' + PRIVACY_URL + '">' + t.more + '</a>';
  }
  function render() {
    var t = T[getLang()];
    if (!box) {
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      box = document.createElement('div'); box.id = 'msh-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    box.setAttribute('aria-label', t.settings);
    box.innerHTML = '<div class="in"><p>' + t.text + ' ' + privacyLink(t) + '</p><div class="btns">' +
      '<button type="button" class="deny">' + t.deny + '</button><button type="button" class="ok">' + t.ok + '</button></div></div>';
    box.querySelector('.deny').onclick = function () { write('denied'); hide(); };
    box.querySelector('.ok').onclick = function () { write('granted'); hide(); loadGA(); };
    var pl = document.getElementById('msh-consent-privacy');
    if (pl) pl.onclick = function (e) { e.preventDefault(); document.getElementById('datenschutz-modal').style.display = 'block'; };
    box.style.display = '';
  }
  function hide() { if (box) box.style.display = 'none'; }

  function relabelFooterLinks() {
    var t = T[getLang()];
    var links = document.querySelectorAll('[data-consent-open]');
    for (var i = 0; i < links.length; i++) links[i].textContent = t.settings;
  }

  window.mshConsent = {
    open: function () { render(); },
    setLang: function () { relabelFooterLinks(); if (box && box.style.display !== 'none') render(); },
    status: function () { return read(); }
  };

  function init() {
    relabelFooterLinks();
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-consent-open]');
      if (a) { e.preventDefault(); render(); }
    });
    var c = read();
    if (c === 'granted') loadGA();
    else if (c !== 'denied') render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
