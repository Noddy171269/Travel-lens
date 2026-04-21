import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    const MOUSE = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => { MOUSE.x = e.clientX; MOUSE.y = e.clientY; };
    const handleMouseLeave = () => { MOUSE.x = -9999; MOUSE.y = -9999; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ── Star Field ──
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      twinkleSpeed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    function drawStars(t) {
      stars.forEach((s) => {
        const brightness = 0.3 + Math.sin(t * s.twinkleSpeed + s.phase) * 0.35 + 0.35;
        const x = s.x * canvas.width;
        const y = s.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${brightness * 0.7})`;
        ctx.fill();
      });
    }

    // ── Shooting Stars ──
    let shootingStars = [];
    let lastShootTime = 0;

    function spawnShootingStar(t) {
      if (t - lastShootTime > 2500 + Math.random() * 4000) {
        lastShootTime = t;
        const startX = Math.random() * canvas.width * 0.8;
        shootingStars.push({
          x: startX,
          y: Math.random() * canvas.height * 0.4,
          vx: 4 + Math.random() * 4,
          vy: 2 + Math.random() * 2,
          life: 1,
          decay: 0.008 + Math.random() * 0.008,
          length: 60 + Math.random() * 80,
        });
      }
    }

    function drawShootingStars() {
      shootingStars = shootingStars.filter((s) => s.life > 0);
      shootingStars.forEach((s) => {
        const tailX = s.x - s.vx * (s.length / 6);
        const tailY = s.y - s.vy * (s.length / 6);
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(200, 220, 255, ${s.life * 0.9})`);
        grad.addColorStop(0.3, `rgba(130, 160, 255, ${s.life * 0.5})`);
        grad.addColorStop(1, `rgba(99, 102, 241, 0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 255, ${s.life})`;
        ctx.fill();

        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
      });
    }

    // ── Aurora / Nebula Waves ──
    function drawAurora(t) {
      const auroraConfigs = [
        { yBase: 0.3, amplitude: 80, color1: [99, 102, 241], color2: [6, 182, 212], opacity: 0.04, freq: 0.003, speed: 0.0004 },
        { yBase: 0.55, amplitude: 60, color1: [129, 140, 248], color2: [34, 211, 238], opacity: 0.03, freq: 0.004, speed: -0.0003 },
        { yBase: 0.75, amplitude: 50, color1: [99, 102, 241], color2: [129, 140, 248], opacity: 0.025, freq: 0.002, speed: 0.0005 },
      ];

      auroraConfigs.forEach((cfg) => {
        ctx.beginPath();
        const baseY = canvas.height * cfg.yBase;
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= canvas.width; x += 3) {
          const wave = Math.sin(x * cfg.freq + t * cfg.speed) * cfg.amplitude
            + Math.sin(x * cfg.freq * 1.8 + t * cfg.speed * 1.3) * cfg.amplitude * 0.5;
          ctx.lineTo(x, baseY + wave);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - cfg.amplitude, 0, baseY + cfg.amplitude + 200);
        grad.addColorStop(0, `rgba(${cfg.color1.join(',')}, ${cfg.opacity * 1.5})`);
        grad.addColorStop(0.5, `rgba(${cfg.color2.join(',')}, ${cfg.opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    // ── Floating Particles ──
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.6,
      colorIdx: Math.floor(Math.random() * 3),
      phase: Math.random() * Math.PI * 2,
    }));

    const pColors = [
      [99, 102, 241],
      [6, 182, 212],
      [129, 140, 248],
    ];

    function drawParticles(t) {
      const LINK_DIST = 130;

      particles.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - MOUSE.x;
        const dy = p.y - MOUSE.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        const glow = 0.4 + Math.sin(t * 0.002 + p.phase) * 0.2;
        const c = pColors[p.colorIdx];

        // Glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grad.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${glow * 0.25})`);
        grad.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${glow + 0.2})`;
        ctx.fill();
      });

      // Links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    // ── Large Ambient Orbs ──
    const orbs = [
      { xRatio: 0.15, yRatio: 0.2, radius: 280, color: [99, 102, 241], opacity: 0.07, sx: 0.00015, sy: 0.0002 },
      { xRatio: 0.75, yRatio: 0.5, radius: 320, color: [6, 182, 212], opacity: 0.05, sx: -0.0002, sy: 0.00015 },
      { xRatio: 0.5, yRatio: 0.85, radius: 260, color: [129, 140, 248], opacity: 0.055, sx: 0.00018, sy: -0.00012 },
    ];

    function drawOrbs(t) {
      orbs.forEach((o) => {
        const cx = canvas.width * (o.xRatio + Math.sin(t * o.sx) * 0.08);
        const cy = canvas.height * (o.yRatio + Math.cos(t * o.sy) * 0.08);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.radius);
        grad.addColorStop(0, `rgba(${o.color.join(',')}, ${o.opacity})`);
        grad.addColorStop(0.6, `rgba(${o.color.join(',')}, ${o.opacity * 0.3})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, o.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ── Main Loop ──
    function animate(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#08081a');
      bgGrad.addColorStop(0.4, '#0c0c24');
      bgGrad.addColorStop(0.7, '#0f0f1a');
      bgGrad.addColorStop(1, '#0a0a1e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawOrbs(t);
      drawAurora(t);
      drawStars(t);
      spawnShootingStar(t);
      drawShootingStars();
      drawParticles(t);

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
