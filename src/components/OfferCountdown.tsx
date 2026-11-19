import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const OFFER_END_STORAGE_KEY = 'nespresso_sg_swarovski_offer_end_v1';
// Default duration: 2 days, 14 hours, 36 minutes, 48 seconds
const DEFAULT_DURATION_MS =
  (2 * 24 * 60 * 60 + 14 * 60 * 60 + 36 * 60 + 48) * 1000;

function getOrCreateOfferEndTimestamp(): number {
  const now = Date.now();
  if (typeof window === 'undefined') {
    return now + DEFAULT_DURATION_MS;
  }
  try {
    const stored = window.localStorage.getItem(OFFER_END_STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed > now + 60_000) {
        return parsed;
      }
    }
    const nextEnd = now + DEFAULT_DURATION_MS;
    window.localStorage.setItem(OFFER_END_STORAGE_KEY, String(nextEnd));
    return nextEnd;
  } catch {
    return now + DEFAULT_DURATION_MS;
  }
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeRemaining(endTs: number): TimeRemaining {
  const diff = Math.max(0, endTs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

interface OfferCountdownProps {
  label?: string;
  variant?: 'dark' | 'light';
  compact?: boolean;
}

export function OfferCountdown({
  label = 'Offer Ends In',
  variant = 'dark',
  compact = false,
}: OfferCountdownProps) {
  const [endTimestamp, setEndTimestamp] = useState<number>(getOrCreateOfferEndTimestamp);
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    computeRemaining(endTimestamp)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Date.now() >= endTimestamp) {
        const renewed = Date.now() + DEFAULT_DURATION_MS;
        try {
          window.localStorage.setItem(OFFER_END_STORAGE_KEY, String(renewed));
        } catch {
          // Ignore storage errors
        }
        setEndTimestamp(renewed);
        setRemaining(computeRemaining(renewed));
      } else {
        setRemaining(computeRemaining(endTimestamp));
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endTimestamp]);

  const isDark = variant === 'dark';

  const units = [
    { value: pad2(remaining.days), unit: 'Days' },
    { value: pad2(remaining.hours), unit: 'Hrs' },
    { value: pad2(remaining.minutes), unit: 'Min' },
    { value: pad2(remaining.seconds), unit: 'Sec' },
  ];

  return (
    <div
      className={`rounded-sm border ${
        isDark
          ? 'bg-[#24211F] border-[#9E7B4F]/45 text-[#FAF9F6]'
          : 'bg-[#FAF9F6] border-[#DDD3C3] text-[#1B1918]'
      } ${compact ? 'px-3.5 py-2.5' : 'px-4 py-3.5'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock
            className={`w-3.5 h-3.5 shrink-0 ${
              isDark ? 'text-[#C9A97E]' : 'text-[#9E7B4F]'
            }`}
          />
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
              isDark ? 'text-[#C9A97E]' : 'text-[#7D5E37]'
            }`}
          >
            {label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2" aria-label={`${label}: ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`}>
          {units.map((u, idx) => (
            <div key={u.unit} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`min-w-[44px] sm:min-w-[48px] px-2 py-1.5 rounded-sm text-center border ${
                  isDark
                    ? 'bg-[#141312] border-white/10'
                    : 'bg-[#FFFFFF] border-[#E7E4DF]'
                }`}
              >
                <div
                  className={`font-mono text-sm sm:text-base font-semibold leading-none tabular-nums ${
                    isDark ? 'text-[#FAF9F6]' : 'text-[#1B1918]'
                  }`}
                >
                  {u.value}
                </div>
                <div
                  className={`text-[10px] uppercase tracking-[0.1em] mt-1 leading-none ${
                    isDark ? 'text-[#A8A29B]' : 'text-[#7A746E]'
                  }`}
                >
                  {u.unit}
                </div>
              </div>
              {idx < units.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`font-mono text-xs font-semibold ${
                    isDark ? 'text-[#C9A97E]/70' : 'text-[#9E7B4F]'
                  }`}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
