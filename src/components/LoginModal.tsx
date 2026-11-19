import { useState } from 'react';
import { Award, Check, LogOut, UserCheck, X } from 'lucide-react';
import {
  MEMBERSHIP_TIERS,
  MemberAccount,
  PRESET_MEMBERS,
  getTierProgress,
} from '../data/membership';

interface LoginModalProps {
  isOpen: boolean;
  member: MemberAccount | null;
  onClose: () => void;
  onLogin: (account: MemberAccount) => void;
  onLogout: () => void;
}

export function LoginModal({
  isOpen,
  member,
  onClose,
  onLogin,
  onLogout,
}: LoginModalProps) {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSwitchForm, setShowSwitchForm] = useState(false);

  if (!isOpen) return null;

  const isViewingAccount = Boolean(member) && !showSwitchForm;
  const tierInfo = member ? getTierProgress(member.annualSpend) : null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !passwordInput.trim()) {
      setErrorMsg('Please enter a valid email address and password.');
      return;
    }

    const matchedPreset = PRESET_MEMBERS.find(
      (preset) => preset.email.toLowerCase() === trimmedEmail
    );

    if (matchedPreset) {
      onLogin(matchedPreset);
    } else {
      const derivedName =
        nameInput.trim() ||
        trimmedEmail
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (ch) => ch.toUpperCase());

      onLogin({
        id: `member-${Date.now()}`,
        name: derivedName,
        email: trimmedEmail,
        annualSpend: 0,
      });
    }

    setErrorMsg('');
    setPasswordInput('');
    setShowSwitchForm(false);
    onClose();
  };

  const handleQuickLogin = (preset: MemberAccount) => {
    setErrorMsg('');
    setShowSwitchForm(false);
    onLogin(preset);
    onClose();
  };

  const handleLogoutClick = () => {
    setShowSwitchForm(false);
    onLogout();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1918]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Nespresso Club Membership Login"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-[#FAF9F6] border border-[#E7E4DF] rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-b border-[#E7E4DF] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9E7B4F]">
              Nespresso Club Singapore
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#1B1918]">
              {isViewingAccount ? 'Membership Tier & Progress' : 'Sign In to Nespresso Club'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-[#57524E] hover:text-[#1B1918] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {isViewingAccount && member && tierInfo ? (
            <>
              {/* Signed-In Member Summary */}
              <div className="bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#F5F2EC] border border-[#E7E4DF] flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5 text-[#9E7B4F]" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-[#1B1918]">{member.name}</div>
                      <div className="text-xs text-[#6B655F]">{member.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9E7B4F]">
                      {tierInfo.currentTier.name}
                    </div>
                    <div className="font-mono text-xs text-[#57524E] tabular-nums mt-0.5">
                      ${member.annualSpend} / ${tierInfo.targetThreshold}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-[#F0EDE7]">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-[#4A4642]">
                      {tierInfo.nextTier ? (
                        <>
                          You are{' '}
                          <span className="font-semibold text-[#1B1918] tabular-nums">
                            ${tierInfo.amountToNext}
                          </span>{' '}
                          away from{' '}
                          <span className="font-semibold text-[#1B1918]">
                            {tierInfo.nextTier.name}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-[#2C4C3E]">
                          Highest Nespresso Club tier unlocked
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-xs font-medium text-[#1B1918] tabular-nums">
                      {tierInfo.progressPercent}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-[#DFDAD1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#9E7B4F] rounded-full transition-all duration-500"
                      style={{ width: `${tierInfo.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Membership Tiers Ladder */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#57524E]">
                  Singapore Membership Tiers
                </div>
                <div className="space-y-2.5">
                  {MEMBERSHIP_TIERS.map((tier) => {
                    const isCurrent = tier.id === tierInfo.currentTier.id;
                    const isUnlocked = member.annualSpend >= tier.minSpend;
                    return (
                      <div
                        key={tier.id}
                        className={`p-4 rounded-sm border ${
                          isCurrent
                            ? 'bg-[#FFFFFF] border-[#1B1918]'
                            : 'bg-[#FFFFFF] border-[#E7E4DF]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Award
                              className={`w-4 h-4 shrink-0 ${
                                isUnlocked ? 'text-[#9E7B4F]' : 'text-[#A8A29B]'
                              }`}
                            />
                            <span className="text-sm font-semibold text-[#1B1918]">
                              {tier.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-[#6B655F] tabular-nums">
                            {tier.minSpend === 0 ? 'From $0' : `$${tier.minSpend}+ Spend`}
                          </span>
                        </div>
                        <ul className="mt-2.5 space-y-1">
                          {tier.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-start gap-2 text-xs text-[#57524E]"
                            >
                              <Check className="w-3.5 h-3.5 text-[#9E7B4F] shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowSwitchForm(true)}
                  className="px-4 py-2.5 bg-[#FFFFFF] border border-[#DDD8D0] hover:border-[#1B1918] text-xs font-semibold uppercase tracking-[0.12em] text-[#1B1918] rounded-sm transition-colors cursor-pointer"
                >
                  Switch Member Account
                </button>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B1918] hover:bg-[#332F2D] text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Sign In Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {errorMsg && (
                  <div
                    role="alert"
                    className="bg-[#FDF4F2] border border-[#E3B5AA] text-[#8C2D19] text-xs p-3 rounded-sm"
                  >
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="club-name"
                    className="block text-xs font-medium text-[#4A4642] mb-1"
                  >
                    Full Name (optional for existing members)
                  </label>
                  <input
                    id="club-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Jocelyn C."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="club-email"
                    className="block text-xs font-medium text-[#4A4642] mb-1"
                  >
                    Nespresso Club Email
                  </label>
                  <input
                    id="club-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="jocelyn.c@nespresso.sg"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="club-password"
                    className="block text-xs font-medium text-[#4A4642] mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="club-password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#DDD8D0] rounded-sm focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.12em] rounded-sm transition-colors cursor-pointer min-h-[44px]"
                  >
                    Log In to Nespresso Club
                  </button>
                  {showSwitchForm && (
                    <button
                      type="button"
                      onClick={() => setShowSwitchForm(false)}
                      className="px-4 py-3 border border-[#DDD8D0] hover:border-[#1B1918] text-xs font-semibold uppercase tracking-[0.12em] text-[#1B1918] rounded-sm transition-colors cursor-pointer min-h-[44px]"
                    >
                      Back
                    </button>
                  )}
                </div>
              </form>

              {/* Quick Member Demo Switcher */}
              <div className="pt-4 border-t border-[#E7E4DF] space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#57524E]">
                  Quick Sign-In by Membership Tier
                </div>
                <div className="space-y-2">
                  {PRESET_MEMBERS.map((preset) => {
                    const info = getTierProgress(preset.annualSpend);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleQuickLogin(preset)}
                        className="w-full text-left p-3.5 bg-[#FFFFFF] border border-[#E7E4DF] hover:border-[#1B1918] rounded-sm transition-colors cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#1B1918]">
                            {preset.name}
                          </div>
                          <div className="text-xs text-[#6B655F] truncate mt-0.5">
                            {info.currentTier.name} · {preset.email}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-medium text-[#9E7B4F] tabular-nums shrink-0">
                          ${preset.annualSpend} / ${info.targetThreshold}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
