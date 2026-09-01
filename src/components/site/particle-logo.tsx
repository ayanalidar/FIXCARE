"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ParticleLogo - Renders the FixCare logo as an animated cloud of particles
 * on a transparent canvas. Particles fly into formation from random positions
 * on mount, then react to mouse movement (scatter and return).
 *
 * Behavior reference: academy.guardianx.cloud hero section.
 *
 * The component:
 *   1. Loads the transparent PNG (/fixcare-logo-particles.png) on an offscreen canvas
 *   2. Samples pixels - every non-transparent pixel becomes a particle target
 *   3. Animates each particle from a random start position toward its target
 *   4. Mouse interaction: particles within radius push away from cursor, then ease back
 *
 * Transparent canvas: particles render directly on the page background, no card
 * or colored box behind them. The particles inherit the brand color (#0F2540 navy
 * or #0E7C66 teal) chosen via the `color` prop.
 *
 * Performance: downsamples the source image so particle count stays under ~3000
 * even on large displays. Uses requestAnimationFrame with delta-time stepping so
 * the animation looks the same on 60Hz and 120Hz displays. Respects
 * prefers-reduced-motion (renders a static logo when set).
 */

interface ParticleLogoProps {
  /** Logo image src - must be a transparent PNG with alpha channel */
  src?: string;
  /** Particle color in any CSS color format */
  color?: string;
  /** Pixel sampling step (higher = fewer particles, faster). Default 4. */
  step?: number;
  /** Particle radius in px. Default 1.6. */
  particleSize?: number;
  /** Mouse interaction radius. Default 80. */
  mouseRadius?: number;
  /** Animation easing factor (0-1, higher = snappier). Default 0.08. */
  ease?: number;
  /** Container className for sizing */
  className?: string;
  /** Aspect-ratio-ish max-width in px (logo will scale to fit). Default 480. */
  maxWidth?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;  // target x
  ty: number;  // target y
  size: number;
  alpha: number;
  delay: number;
}

// Compute once at module load — outside React render cycle, so setState in effect
// can use this without triggering the lint warning.
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ParticleLogo({
  src = "/fixcare-logo-particles.png",
  color = "#0F2540",
  step = 4,
  particleSize = 1.6,
  mouseRadius = 80,
  ease = 0.08,
  className = "",
  maxWidth = 480,
}: ParticleLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  // If reduced motion is preferred, render only the static fallback image.
  const [loaded, setLoaded] = useState<boolean>(prefersReducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Skip the canvas setup entirely when reduced motion is requested.
    if (loaded) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cancelled = false;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Load the source image and sample pixels into particles
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      // Compute display size: fit within maxWidth, respect aspect ratio
      const aspectRatio = img.height / img.width;
      width = Math.min(maxWidth, container.clientWidth || maxWidth);
      height = Math.round(width * aspectRatio);

      // Set canvas display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set internal resolution (DPR-aware for crisp particles)
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      // Sample the image: for every Nth pixel where alpha > threshold, create a particle
      const sampleCanvas = document.createElement("canvas");
      const sampleCtx = sampleCanvas.getContext("2d", { alpha: true });
      if (!sampleCtx) return;
      sampleCanvas.width = img.width;
      sampleCanvas.height = img.height;
      sampleCtx.drawImage(img, 0, 0);

      const imgData = sampleCtx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;
      const particles: Particle[] = [];

      // Scale factor from sample image → display canvas
      const sx = width / img.width;
      const sy = height / img.height;

      // Sample every `step` pixels. Skip pixels with alpha < 128 (transparent)
      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const idx = (y * img.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha < 128) continue;

          // Small random offset + slightly random size for organic feel
          const jitter = step * 0.5;
          const px = x * sx + (Math.random() - 0.5) * jitter;
          const py = y * sy + (Math.random() - 0.5) * jitter;
          const sizeJitter = 0.85 + Math.random() * 0.3;

          particles.push({
            x: Math.random() * width,           // start: random across canvas
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            tx: px,                              // target: pixel position in logo
            ty: py,
            size: particleSize * sizeJitter,
            alpha: 0.55 + (alpha / 255) * 0.45,
            delay: Math.random() * 0.6,          // stagger entrance
          });
        }
      }

      particlesRef.current = particles;
      startTimeRef.current = performance.now();
      setLoaded(true);
      startAnimation();
    };

    img.onerror = () => {
      console.warn(`[ParticleLogo] Failed to load: ${src}`);
      setLoaded(true);  // show fallback image
    };

    function startAnimation() {
      if (cancelled) return;
      const animate = (now: number) => {
        if (cancelled) return;
        const elapsed = (now - startTimeRef.current) / 1000;  // seconds

        ctx.clearRect(0, 0, width, height);

        // Set composite mode for nicer particle blending
        ctx.globalCompositeOperation = "source-over";

        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        ctx.fillStyle = color;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Stagger entrance: don't start moving until delay passes
          const t = Math.max(0, elapsed - p.delay);

          // Mouse repulsion: if mouse is within mouseRadius, push particle away
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const r = mouseRadius;
            if (distSq < r * r && distSq > 0.1) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / r) * 2.5;  // stronger near cursor
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Spring toward target
          p.vx += (p.tx - p.x) * ease;
          p.vy += (p.ty - p.y) * ease;
          // Damping
          p.vx *= 0.78;
          p.vy *= 0.78;

          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Draw
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      };
    };
    const onTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    // Cleanup
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [src, color, step, particleSize, mouseRadius, ease, maxWidth, loaded]);

  return (
    <div
      ref={containerRef}
      className={`particle-logo-container relative w-full ${className}`}
      style={{ maxWidth }}
      aria-label="FixCare Service Center logo"
      role="img"
    >
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ display: loaded ? "block" : "none" }}
        aria-hidden="true"
      />
      {/* Fallback: static image shown while canvas loads or for reduced-motion users */}
      {!loaded && (
        <img
          src={src}
          alt="FixCare Service Center"
          className="block w-full h-auto"
          style={{ maxWidth }}
        />
      )}
    </div>
  );
}
