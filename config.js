// APPSCON 2026 – quiz buzzer: shared settings for the screen and the phones.
// The topic is private to this quiz (different from the e-Souvenir unveil topic).
window.QUIZ = {
  broker: 'wss://broker.hivemq.com:8884/mqtt',
  topic: 'appscon26/quiz/q7v3mx92kd4t8p',
  teams: [
    { name: 'Team A', color: '#E63946' },
    { name: 'Team B', color: '#3A86FF' },
    { name: 'Team C', color: '#FFB703' },
    { name: 'Team D', color: '#2DC653' }
  ]
};

// Picks dark or white text, whichever reads better on a team colour.
window.inkFor = function (hex) {
  const lum = h => {
    const n = parseInt(h.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const L = lum(hex);
  const onWhite = 1.05 / (L + 0.05);
  const onDark = (L + 0.05) / (lum('#12162B') + 0.05);
  return onWhite >= onDark ? '#FFFFFF' : '#12162B';
};

// One buzzer sound for every team: buzzer.wav (same folder as the pages).
// Loaded once into Web Audio so it plays instantly. If the file can't load,
// a built-in buzzer is used instead.
(function () {
  let BUF = null, loading = false;
  function preload(ctx) {
    if (!ctx || BUF || loading) return;
    loading = true;
    fetch('buzzer.wav?v=4')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(ab => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
      .then(b => { BUF = b; })
      .catch(e => { loading = false; console.warn('buzzer.wav not loaded', e); });
  }
  function fallback(ctx, vol) {
    const t0 = ctx.currentTime + 0.01;
    [[150, 'sawtooth', 0.6], [153, 'square', 0.35]].forEach(([f, type, k]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol * k, t0 + 0.01);
      g.gain.setValueAtTime(vol * k, t0 + 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
      o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + 0.6);
    });
  }
  window.preloadBuzzSound = preload;
  // Same sound for all teams; the team number is ignored.
  window.playTeamSound = function (ctx, i, vol) {
    if (!ctx) return;
    preload(ctx);
    if (!BUF) { fallback(ctx, vol || 0.3); return; }
    const src = ctx.createBufferSource();
    src.buffer = BUF; src.connect(ctx.destination); src.start();
  };
})();

// ---------- Quiz-laptop lock ----------
// host.html and scoreboard.html control the quiz. On any device that hasn't
// been unlocked with this code, they show a notice instead and stay off the
// relay, so opening them by mistake on a phone can't disturb the buzzers or
// the MC's live scores. Change the code here if you like.
window.QUIZ.operatorCode = '2026';
window.operatorGate = function (onUnlock) {
  const KEY = 'appscon-quiz-operator';
  let ok = false;
  try { ok = localStorage.getItem(KEY) === String(window.QUIZ.operatorCode); } catch (e) {}
  if (ok) { onUnlock(); return true; }
  const css = document.createElement('style');
  css.textContent = `
  .gate { position: fixed; inset: 0; z-index: 50; background: #12162B; color: #F2F4FF; display: grid; place-items: center; padding: 24px;
    font-family: 'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif; cursor: auto; }
  .gate .box { max-width: 460px; width: 100%; }
  .gate h1 { margin: 0 0 10px; font-size: 28px; }
  .gate p { margin: 0 0 18px; color: #8D95C2; line-height: 1.5; font-size: 16px; }
  .gate a.go { display: block; text-align: center; background: #F2F4FF; color: #12162B; font-weight: 800; text-decoration: none; border-radius: 12px; padding: 14px; font-size: 18px; }
  .gate .op { margin-top: 28px; padding-top: 18px; border-top: 1px solid #2B3260; }
  .gate .op label { display: block; font-size: 14px; color: #8D95C2; margin-bottom: 8px; }
  .gate .row { display: flex; gap: 8px; }
  .gate input { flex: 1; min-width: 0; font: inherit; font-size: 18px; background: #1C2242; color: #F2F4FF; border: 1px solid #2B3260; border-radius: 10px; padding: 10px 12px; }
  .gate button { font: inherit; font-weight: 700; background: #2B3260; color: #F2F4FF; border: 0; border-radius: 10px; padding: 10px 16px; cursor: pointer; }
  .gate .err { color: #FF7A7A; font-size: 14px; min-height: 1.4em; margin-top: 8px; }
  .gate :focus-visible { outline: 3px solid #FFB703; outline-offset: 2px; }`;
  document.head.appendChild(css);
  const g = document.createElement('div');
  g.className = 'gate'; g.id = 'gate';
  g.innerHTML = `<div class="box">
    <h1>Quiz laptop only</h1>
    <p>This page runs the quiz on the big screen. Opening it on another phone, tablet or laptop could disturb the buzzers and the live scores, so it is locked here.</p>
    <a class="go" href="scores.html">Open the live screen</a>
    <div class="op"><label for="gateCode">Setting up the quiz laptop? Enter the operator code once:</label>
      <div class="row"><input id="gateCode" type="password" inputmode="numeric" autocomplete="off"><button id="gateBtn">Unlock</button></div>
      <div class="err" id="gateErr"></div></div></div>`;
  document.body.appendChild(g);
  const tryCode = () => {
    const v = g.querySelector('#gateCode').value.trim();
    if (v !== String(window.QUIZ.operatorCode)) { g.querySelector('#gateErr').textContent = 'That code is not right.'; return; }
    try { localStorage.setItem(KEY, v); } catch (e) {}
    g.remove(); onUnlock();
  };
  g.querySelector('#gateBtn').addEventListener('click', tryCode);
  g.querySelector('#gateCode').addEventListener('keydown', e => { if (e.key === 'Enter') tryCode(); e.stopPropagation(); });
  return false;
};
window.gateOpen = () => !!document.getElementById('gate');
