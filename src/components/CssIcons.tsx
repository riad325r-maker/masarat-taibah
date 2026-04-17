export function FuelDropIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-b-full"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, var(--orange), var(--orange-light))',
          borderRadius: `50% 50% 50% 50% / 30% 30% 70% 70%`,
          transform: 'rotate(0deg)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          top: '35%',
          left: '25%',
          background: 'rgba(255,255,255,0.35)',
        }}
      />
    </div>
  );
}

export function TankerIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 0.65 }}>
      <div className="absolute bottom-[20%] left-0 rounded-md" style={{ width: '70%', height: '50%', background: 'var(--orange)', borderRadius: '4px 12px 4px 4px' }} />
      <div className="absolute bottom-[20%] right-0 rounded-sm" style={{ width: '35%', height: '35%', background: 'var(--orange-light)', borderRadius: '2px' }} />
      <div className="absolute bottom-0 rounded-full" style={{ width: size * 0.2, height: size * 0.2, left: '12%', background: 'var(--text-0)', border: '2px solid var(--orange)' }} />
      <div className="absolute bottom-0 rounded-full" style={{ width: size * 0.2, height: size * 0.2, right: '15%', background: 'var(--text-0)', border: '2px solid var(--orange)' }} />
    </div>
  );
}

export function BuildingIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute bottom-0 left-[10%]" style={{ width: '35%', height: '90%', background: 'var(--orange)', borderRadius: '3px 3px 0 0' }}>
        {[0.15, 0.35, 0.55, 0.75].map((t, i) => (
          <div key={i} className="absolute" style={{ width: '40%', height: '10%', left: '30%', top: `${t * 100}%`, background: 'var(--bg-1)', borderRadius: 1 }} />
        ))}
      </div>
      <div className="absolute bottom-0 right-[10%]" style={{ width: '40%', height: '65%', background: 'var(--orange-light)', borderRadius: '3px 3px 0 0' }}>
        {[0.2, 0.45, 0.7].map((t, i) => (
          <div key={i} className="absolute" style={{ width: '35%', height: '12%', left: '32%', top: `${t * 100}%`, background: 'var(--bg-1)', borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
}

export function CalendarIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-x-[5%] bottom-0 rounded-lg" style={{ height: '80%', background: 'var(--accent-bg)', border: '2px solid var(--orange)' }}>
        <div className="absolute top-0 left-0 right-0 rounded-t-md" style={{ height: '30%', background: 'var(--orange)' }} />
        <div className="absolute bottom-[15%] left-[15%] right-[15%] grid grid-cols-3 gap-[2px]" style={{ top: '40%' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-sm" style={{ background: i === 2 ? 'var(--orange)' : 'var(--text-3)', aspectRatio: '1' }} />
          ))}
        </div>
      </div>
      <div className="absolute rounded-full" style={{ width: '12%', height: '20%', left: '25%', top: '5%', background: 'var(--orange)' }} />
      <div className="absolute rounded-full" style={{ width: '12%', height: '20%', right: '25%', top: '5%', background: 'var(--orange)' }} />
    </div>
  );
}

export function StarRating({ rating, size = 18, interactive = false, onChange }: { rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          className={`relative transition-transform duration-200 ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <defs>
              <linearGradient id={`star-grad-${star}-${rating}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff6a00" />
                <stop offset="100%" stopColor="#ffc46b" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= rating ? `url(#star-grad-${star}-${rating})` : 'none'}
              stroke={star <= rating ? '#ff6a00' : 'var(--text-3)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
