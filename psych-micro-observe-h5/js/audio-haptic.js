/**
 * 极简环境音 + 点击反馈（需用户手势后解锁 WebAudio）
 */
(function (global) {
  let ctxAudio = null;
  let noiseNode = null;
  let gainNode = null;
  let unlocked = false;

  function ensureContext() {
    if (!ctxAudio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxAudio = new AC();
    }
    return ctxAudio;
  }

  function unlock() {
    const ac = ensureContext();
    if (!ac || unlocked) return;
    if (ac.state === 'suspended') ac.resume();
    unlocked = true;
  }

  function startAmbient() {
    const ac = ensureContext();
    if (!ac) return;
    unlock();
    if (noiseNode) return;

    const bufferSize = 2 * ac.sampleRate;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;

    gainNode = ac.createGain();
    gainNode.gain.value = 0.045;

    const pad = ac.createOscillator();
    pad.type = 'sine';
    pad.frequency.value = 98;
    const padGain = ac.createGain();
    padGain.gain.value = 0.018;

    noise.connect(filter);
    filter.connect(gainNode);
    pad.connect(padGain);
    padGain.connect(gainNode);
    gainNode.connect(ac.destination);

    pad.start();
    noise.start();
    noiseNode = noise;
  }

  function playClick() {
    const ac = ensureContext();
    if (!ac) return;
    unlock();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ac.currentTime);
    g.gain.setValueAtTime(0.06, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.07);
  }

  function playMagnet() {
    const ac = ensureContext();
    if (!ac) return;
    unlock();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(440, ac.currentTime + 0.12);
    g.gain.setValueAtTime(0.04, ac.currentTime);
    g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.15);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.16);
  }

  global.MicroAudio = {
    unlock: unlock,
    startAmbient: startAmbient,
    playClick: playClick,
    playMagnet: playMagnet,
  };
})(typeof window !== 'undefined' ? window : globalThis);
