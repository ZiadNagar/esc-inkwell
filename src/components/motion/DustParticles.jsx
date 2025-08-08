import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const DustParticles = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const dots = el.querySelectorAll('[data-dot]');
    const ctx = gsap.context(() => {
      dots.forEach((dot, i) => {
        const delay = (i % 10) * 0.3;
        gsap.to(dot, {
          x: `+=${(i % 5) * 6 - 12}`,
          y: `+=${(i % 7) * 4 - 10}`,
          opacity: 0.15 + ((i % 5) * 0.05),
          duration: 6 + (i % 4),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay,
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <circle
          key={i}
          data-dot
          cx={`${(i * 17) % 100}%`}
          cy={`${(i * 29) % 100}%`}
          r={(i % 3) + 0.5}
          fill="rgba(0,0,0,0.15)"
        />
      ))}
    </svg>
  );
}


