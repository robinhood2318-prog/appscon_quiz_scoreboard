// APPSCON 2026 – quiz buzzer: shared settings for the screen and the phones.
// The topic is private to this quiz (different from the e-Souvenir unveil topic).
window.QUIZ = {
  broker: 'wss://broker.hivemq.com:8884/mqtt',
  topic: 'appscon26/quiz/q7v3mx92kd4t8p',
  teams: [
    { name: 'Team 1', color: '#E63946' },
    { name: 'Team 2', color: '#3A86FF' },
    { name: 'Team 3', color: '#FFB703' },
    { name: 'Team 4', color: '#2DC653' }
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
