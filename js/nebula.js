/**
 * 心理星云球：球面微粒 + 呼吸缩放 + 触摸驱散与涟漪
 */
(function (global) {
  function initNebula(canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let cssW = 0;
    let cssH = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    const COUNT = Math.min(1600, Math.floor((typeof window !== 'undefined' ? window.innerWidth : 375) * 4));
    const particles = [];
    let breathT = 0;
    const ripples = [];
    let running = false;
    let rafId = 0;

    function project(theta, phi, R) {
      const x0 = R * Math.sin(phi) * Math.cos(theta);
      const y0 = R * Math.sin(phi) * Math.sin(theta);
      const z0 = R * Math.cos(phi);
      const tilt = 0.42;
      const x = x0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = x0 * Math.sin(tilt) + z0 * Math.cos(tilt);
      const y = y0;
      const scale = 0.78 + (z / R + 1) * 0.11;
      return { x: cx + x, y: cy + y, z: z, scale: scale };
    }

    function initSphere() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        particles.push({
          theta: theta,
          phi: phi,
          rJitter: (Math.random() - 0.5) * 0.07,
          size: Math.random() * 1.15 + 0.35,
          baseA: Math.random() * 0.35 + 0.32,
          pushX: 0,
          pushY: 0,
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      cx = cssW / 2;
      cy = cssH * 0.36;
    }

    function scatterTouch(lx, ly) {
      const breath = 1 + Math.sin(breathT) * 0.048;
      const baseR = Math.min(cssW, cssH) * 0.24 * breath;
      ripples.push({ x: lx, y: ly, r: 6, a: 0.42 });
      particles.forEach(function (p) {
        const R = baseR * (1 + p.rJitter);
        const pr = project(p.theta, p.phi, R);
        const x = pr.x + p.pushX;
        const y = pr.y + p.pushY;
        const dx = x - lx;
        const dy = y - ly;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxD = Math.min(cssW, cssH) * 0.22;
        if (dist < maxD && dist > 0.5) {
          const f = ((maxD - dist) / maxD) * 14;
          p.pushX += (dx / dist) * f;
          p.pushY += (dy / dist) * f;
        }
      });
    }

    function onPointer(ev) {
      const rect = canvas.getBoundingClientRect();
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const lx = clientX - rect.left;
      const ly = clientY - rect.top;
      scatterTouch(lx, ly);
      if (window.MicroAudio && typeof window.MicroAudio.playClick === 'function') {
        window.MicroAudio.playClick();
      }
    }

    function tick() {
      if (!running) return;
      breathT += 0.014;
      const breath = 1 + Math.sin(breathT) * 0.048;
      const baseR = Math.min(cssW, cssH) * 0.24 * breath;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const projected = particles.map(function (p) {
        const R = baseR * (1 + p.rJitter);
        const pr = project(p.theta, p.phi, R);
        p.pushX *= 0.9;
        p.pushY *= 0.9;
        return {
          x: pr.x + p.pushX,
          y: pr.y + p.pushY,
          z: pr.z,
          scale: pr.scale,
          p: p,
        };
      });
      projected.sort(function (a, b) {
        return a.z - b.z;
      });

      projected.forEach(function (pr) {
        const p = pr.p;
        const depth = (pr.z / baseR + 1) / 2;
        const a = p.baseA * (0.5 + 0.5 * depth);
        const r = p.size * pr.scale;
        const t = 0.25 + 0.75 * depth;
        const rCol = Math.floor(0 * (1 - t) + 123 * t);
        const gCol = Math.floor(245 * t + 200 * (1 - t));
        const bCol = 255;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rCol + ',' + gCol + ',' + bCol + ',' + a + ')';
        ctx.fill();
      });

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 2.8;
        r.a *= 0.93;
        if (r.a < 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 245, 255,' + r.a * 0.9 + ')';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(tick);
    }

    initSphere();
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('touchstart', onPointer, { passive: true });
    canvas.addEventListener('mousedown', onPointer);

    return {
      start: function () {
        if (running) return;
        running = true;
        tick();
      },
      stop: function () {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      },
      isRunning: function () {
        return running;
      },
      destroy: function () {
        this.stop();
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('touchstart', onPointer);
        canvas.removeEventListener('mousedown', onPointer);
      },
    };
  }

  global.initNebula = initNebula;
})(typeof window !== 'undefined' ? window : globalThis);
