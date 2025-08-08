import { memo } from "react";

// Hand-drawn style inline SVG: ink bottle, fountain pen, and paper sheet
export const InkIllustration = memo(({ className = "w-full h-auto" }) => (
  <svg
    className={className}
    viewBox="0 0 600 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Ink bottle, fountain pen, and paper"
  >
    {/* Paper sheet */}
    <g filter="url(#shadow)">
      <rect x="60" y="80" width="360" height="260" rx="18" fill="#ffffff" />
      <rect
        x="60"
        y="80"
        width="360"
        height="260"
        rx="18"
        stroke="#C9B79A"
        strokeWidth="3"
      />
      {/* scribble lines */}
      <path
        d="M92 128 C 140 118, 180 145, 228 132 S 310 132, 360 128"
        stroke="#8A7E70"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 166 C 140 156, 190 172, 240 164 S 310 166, 360 162"
        stroke="#8A7E70"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 204 C 150 196, 210 206, 268 200 S 330 202, 360 198"
        stroke="#8A7E70"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 242 C 140 234, 188 248, 236 240 S 300 242, 352 238"
        stroke="#8A7E70"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Ink bottle */}
    <g transform="translate(360, 250) rotate(-6)">
      <path
        d="M0 0 l 40 -8 l 28 20 l -8 40 l -52 10 l -20 -24 z"
        fill="#35424B"
        stroke="#111"
        strokeWidth="3"
      />
      <rect
        x="10"
        y="-18"
        width="36"
        height="18"
        rx="4"
        fill="#6B7C86"
        stroke="#111"
        strokeWidth="3"
      />
      <rect
        x="12"
        y="-22"
        width="32"
        height="7"
        rx="3"
        fill="#8FA0AA"
        stroke="#111"
        strokeWidth="3"
      />
      {/* Label */}
      <rect
        x="10"
        y="12"
        width="44"
        height="22"
        rx="4"
        fill="#F7F2E9"
        stroke="#111"
        strokeWidth="2.5"
      />
      <path
        d="M16 24 C 22 20, 32 20, 38 24"
        stroke="#8A7E70"
        strokeWidth="2"
        fill="none"
      />
    </g>

    {/* Fountain pen */}
    <g transform="translate(120, 330) rotate(-18)">
      <rect
        x="0"
        y="0"
        width="220"
        height="18"
        rx="9"
        fill="#2F241E"
        stroke="#111"
        strokeWidth="3"
      />
      <rect
        x="170"
        y="-2"
        width="60"
        height="22"
        rx="10"
        fill="#5C4A3E"
        stroke="#111"
        strokeWidth="3"
      />
      <path
        d="M235 9 l 26 -8 l -8 26 l -18 -10 z"
        fill="#D9C5A5"
        stroke="#111"
        strokeWidth="3"
      />
      <circle cx="26" cy="9" r="4" fill="#D9C5A5" />
    </g>

    {/* subtle random crosshatch */}
    <path
      d="M80 360 l 40 12 M96 344 l 40 12 M112 328 l 40 12"
      stroke="rgba(0,0,0,0.15)"
      strokeWidth="2"
    />

    <defs>
      <filter
        id="shadow"
        x="0"
        y="40"
        width="500"
        height="360"
        filterUnits="userSpaceOnUse"
      >
        <feOffset dx="0" dy="8" />
        <feGaussianBlur stdDeviation="10" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"
        />
        <feBlend in2="SourceGraphic" mode="normal" />
      </filter>
    </defs>
  </svg>
));
