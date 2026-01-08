// ModLift Logo Component
// Extracted M icon mark from the full logo SVG

export default function ModLiftLogo({ className = '', size = 'default' }) {
  const sizes = {
    sm: { icon: 'h-8 w-8', text: 'text-lg', gap: 'gap-2' },
    default: { icon: 'h-10 w-10', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'h-14 w-14', text: 'text-3xl', gap: 'gap-3' },
  }

  const s = sizes[size] || sizes.default

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* M Icon Mark */}
      <div className={`${s.icon} rounded-xl bg-lime-500 p-1.5 shadow-lg shadow-lime-500/25 flex items-center justify-center`}>
        <svg
          viewBox="270 220 480 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main M shape */}
          <path
            fill="#0a0a0a"
            d="M399.62 366.53
              L399.62 584.66
              A0.37 0.37 0 0 1 399.25 585.03
              L322.67 585.03
              A0.39 0.38 90 0 1 322.29 584.64
              L322.29 270.69
              A0.78 0.78 0 0 1 323.07 269.91
              L408.26 269.91
              A3.49 3.47 67.2 0 1 410.71 270.92
              L511.46 370.70
              A0.85 0.84 -44.8 0 0 512.65 370.70
              Q532.70 350.69 613.26 270.76
              Q614.19 269.84 617.02 269.85
              Q664.06 270.02 701.05 269.90
              A0.63 0.63 0 0 1 701.68 270.53
              L701.68 476.26
              A0.55 0.55 0 0 1 701.13 476.81
              L625.06 476.81
              A0.78 0.78 0 0 1 624.28 476.03
              L624.28 365.87
              A0.20 0.20 0 0 0 623.94 365.73
              Q579.45 410.20 514.33 475.38
              Q514.26 475.46 513.46 476.40
              Q512.21 477.89 510.78 476.47
              Q454.81 420.56 400.05 366.35
              A0.25 0.25 0 0 0 399.62 366.53
              Z"
          />
          {/* Bottom bar */}
          <path
            fill="#0a0a0a"
            d="M701.67 505.34
              L701.67 584.71
              A0.32 0.32 0 0 1 701.35 585.03
              L406.69 585.03
              A0.32 0.32 0 0 1 406.47 584.48
              L485.84 505.11
              A0.32 0.32 0 0 1 486.06 505.02
              L701.35 505.02
              A0.32 0.32 0 0 1 701.67 505.34
              Z"
          />
        </svg>
      </div>
      {/* Text */}
      <span className={`${s.text} font-bold tracking-tight text-white`}>
        ModLift
      </span>
    </div>
  )
}

// Icon only version for compact spaces
export function ModLiftIcon({ className = '', size = 40 }) {
  return (
    <div
      className={`rounded-xl bg-lime-500 p-1.5 shadow-lg shadow-lime-500/25 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="270 220 480 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          fill="#0a0a0a"
          d="M399.62 366.53
            L399.62 584.66
            A0.37 0.37 0 0 1 399.25 585.03
            L322.67 585.03
            A0.39 0.38 90 0 1 322.29 584.64
            L322.29 270.69
            A0.78 0.78 0 0 1 323.07 269.91
            L408.26 269.91
            A3.49 3.47 67.2 0 1 410.71 270.92
            L511.46 370.70
            A0.85 0.84 -44.8 0 0 512.65 370.70
            Q532.70 350.69 613.26 270.76
            Q614.19 269.84 617.02 269.85
            Q664.06 270.02 701.05 269.90
            A0.63 0.63 0 0 1 701.68 270.53
            L701.68 476.26
            A0.55 0.55 0 0 1 701.13 476.81
            L625.06 476.81
            A0.78 0.78 0 0 1 624.28 476.03
            L624.28 365.87
            A0.20 0.20 0 0 0 623.94 365.73
            Q579.45 410.20 514.33 475.38
            Q514.26 475.46 513.46 476.40
            Q512.21 477.89 510.78 476.47
            Q454.81 420.56 400.05 366.35
            A0.25 0.25 0 0 0 399.62 366.53
            Z"
        />
        <path
          fill="#0a0a0a"
          d="M701.67 505.34
            L701.67 584.71
            A0.32 0.32 0 0 1 701.35 585.03
            L406.69 585.03
            A0.32 0.32 0 0 1 406.47 584.48
            L485.84 505.11
            A0.32 0.32 0 0 1 486.06 505.02
            L701.35 505.02
            A0.32 0.32 0 0 1 701.67 505.34
            Z"
        />
      </svg>
    </div>
  )
}
